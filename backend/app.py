# backend/app.py
from pathlib import Path
from typing import Dict, List

# IMPORT CORRIGIDO (build em ./backend => pacote raiz é /app)
from backend.api.routers import eda as eda_router

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# ---------------------------------------------------------
# Configuração básica
# ---------------------------------------------------------
app = FastAPI(title="Salifort HR Churn API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # ajuste se precisar restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(eda_router.router, prefix="/eda", tags=["EDA"])

BASE_DIR = Path(__file__).parent
DATA_PATH = BASE_DIR / "data" / "HR_capstone_dataset.csv"
MODEL_PATH = BASE_DIR / "models" / "rf_model.joblib"

# Carrega o modelo/pipeline (tolerante a falhas)
model = None
try:
    if MODEL_PATH.exists():
        model = joblib.load(MODEL_PATH)
        print(f"[boot] Modelo carregado de {MODEL_PATH}")
    else:
        print(f"[boot][WARN] Modelo não encontrado em {MODEL_PATH}")
except Exception as e:
    print(f"[boot][WARN] Falha ao carregar modelo: {e}")

# ---------------------------------------------------------
# Utilitários de dados
# ---------------------------------------------------------
def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [c.strip().lower() for c in df.columns]

    # conserta typo
    if "average_montly_hours" in df.columns and "average_monthly_hours" not in df.columns:
        df = df.rename(columns={"average_montly_hours": "average_monthly_hours"})

    # converte time_spend_company -> tenure, se necessário
    if "tenure" not in df.columns and "time_spend_company" in df.columns:
        df = df.rename(columns={"time_spend_company": "tenure"})

    return df


def load_dataset() -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH)
    df = _normalize_columns(df)

    num_cols = [
        "satisfaction_level",
        "last_evaluation",
        "number_project",
        "average_monthly_hours",
        "tenure",
        "work_accident",
        "promotion_last_5years",
        "left",
    ]
    for c in num_cols:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors="coerce")

    for c in ["department", "salary"]:
        if c in df.columns:
            df[c] = df[c].astype(str).str.strip().str.lower()

    return df


def _to_native(obj):
    if isinstance(obj, (np.integer,)) or str(type(obj)).endswith("int64'>"):
        return int(obj)
    if isinstance(obj, (np.floating,)) or str(type(obj)).endswith("float64'>"):
        return float(obj)
    return obj


def _records_native(rows):
    return [{k: _to_native(v) for k, v in r.items()} for r in rows]


# ---------------------------------------------------------
# Esquema de entrada para previsão (alinhado ao treino)
# ---------------------------------------------------------
class Employee(BaseModel):
    satisfaction_level: float = Field(..., ge=0, le=1)
    last_evaluation: float = Field(..., ge=0, le=1)
    number_project: int = Field(..., ge=0)
    average_monthly_hours: int = Field(..., ge=0)
    tenure: int = Field(..., ge=0)  # usado no treino
    work_accident: int = Field(..., ge=0, le=1)
    promotion_last_5years: int = Field(..., ge=0, le=1)
    department: str
    salary: str  # "low" | "medium" | "high"


# ---------------------------------------------------------
# Rotas principais
# ---------------------------------------------------------
@app.get("/")
def root():
    return {"status": "ok", "message": "API de previsão de rotatividade no ar", "docs": "/docs"}

@app.get("/health")
def health():
    return {"ok": True, "model_loaded": model is not None}

@app.post("/predict")
def predict(emp: Employee):
    if model is None:
        raise HTTPException(status_code=503, detail="Modelo indisponível no servidor")

    payload = emp.dict()
    payload["department"] = payload["department"].strip().lower()
    payload["salary"] = payload["salary"].strip().lower()

    X = pd.DataFrame([payload])
    proba = float(model.predict_proba(X)[0, 1])
    pred = int(proba >= 0.5)
    return {"left_prediction": pred, "probability": round(proba, 4)}


@app.get("/dataset/preview")
def dataset_preview(n: int = 50):
    df = load_dataset()
    n = max(1, min(int(n), 500))
    rows = df.head(n).to_dict(orient="records")
    rows = _records_native(rows)
    return JSONResponse({"rows": rows, "columns": list(df.columns), "count": int(len(df))})


@app.get("/dataset/metrics")
def dataset_metrics():
    df = load_dataset()

    def _safe_mean(col: str, default: float = 0.0) -> float:
        return float(df[col].mean()) if col in df.columns and len(df[col]) else default

    def _safe_vc(col: str) -> Dict[str, int]:
        return {str(k): int(v) for k, v in df[col].value_counts().sort_index().to_dict().items()} if col in df.columns else {}

    churn_rate = _safe_mean("left")
    avg_hours = _safe_mean("average_monthly_hours")
    avg_projects = _safe_mean("number_project")

    if {"left", "average_monthly_hours"}.issubset(df.columns):
        hours_by_left = df.groupby("left")["average_monthly_hours"].mean().to_dict()
        hours_by_left = {("left" if k == 1 else "stayed"): round(float(v), 2) for k, v in hours_by_left.items()}
    else:
        hours_by_left = {}

    proj_hist = _safe_vc("number_project")
    dept_top = {k: int(v) for k, v in df["department"].value_counts().head(5).to_dict().items()} if "department" in df.columns else {}
    salary_dist = {k: int(v) for k, v in df["salary"].value_counts().to_dict().items()} if "salary" in df.columns else {}

    payload = {
        "count": int(len(df)),
        "churn_rate": round(float(churn_rate), 4),
        "avg_hours": round(float(avg_hours), 2),
        "avg_projects": round(float(avg_projects), 2),
        "hours_by_left": hours_by_left,
        "projects_hist": proj_hist,
        "top_departments": dept_top,
        "salary_dist": salary_dist,
    }
    return JSONResponse(payload)

# =========================
# EDA helpers e endpoints
# =========================
def _load_df_for_eda() -> pd.DataFrame:
    df = load_dataset().copy()
    if "left" in df.columns:
        df["left"] = pd.to_numeric(df["left"], errors="coerce").fillna(0).astype(int)
    return df

@app.get("/eda/satisfaction_hist")
def eda_satisfaction_hist(bins: int = 20) -> List[Dict[str, float]]:
    df = _load_df_for_eda()
    vals = df["satisfaction_level"].dropna().to_numpy()
    counts, edges = np.histogram(vals, bins=bins, range=(0, 1))
    centers = (edges[:-1] + edges[1:]) / 2
    return [{"name": f"{c:.2f}", "value": int(n)} for c, n in zip(centers, counts)]

@app.get("/eda/churn_by_satisfaction")
def eda_churn_by_satisfaction(bins: int = 10) -> List[Dict[str, float]]:
    df = _load_df_for_eda()
    s = df["satisfaction_level"].clip(0, 1)
    cats = pd.cut(s, bins=bins, include_lowest=True)
    out = (
        df.groupby(cats)["left"]
        .mean()
        .reset_index()
        .rename(columns={"left": "value"})
    )
    out["value"] = (out["value"] * 100).round(2)
    out = out.rename(columns={"satisfaction_level": "name"})
    out["name"] = out["satisfaction_level"].astype(str) if "satisfaction_level" in out.columns else out.iloc[:, 0].astype(str)
    return out[["name", "value"]].to_dict(orient="records")

@app.get("/eda/churn_by_projects")
def eda_churn_by_projects() -> List[Dict[str, float]]:
    df = _load_df_for_eda()
    out = (
        df.groupby("number_project")["left"]
        .mean()
        .reset_index()
        .rename(columns={"number_project": "name", "left": "value"})
    )
    out["value"] = (out["value"] * 100).round(2)
    out["name"] = out["name"].astype(str)
    return out.to_dict(orient="records")

@app.get("/eda/churn_by_hours")
def eda_churn_by_hours(step: int = 20) -> List[Dict[str, float]]:
    df = _load_df_for_eda()
    hrs = df["average_monthly_hours"].dropna()
    if hrs.empty:
        return []
    bins = range(int(hrs.min()) // step * step, int(hrs.max()) + step, step)
    cats = pd.cut(df["average_monthly_hours"], bins=bins, include_lowest=True)
    out = (
        df.assign(_bucket=cats)
        .groupby("_bucket")["left"]
        .mean()
        .reset_index()
        .rename(columns={"_bucket": "name", "left": "value"})
    )
    out["value"] = (out["value"] * 100).round(2)
    out["name"] = out["name"].astype(str)
    return out.to_dict(orient="records")

@app.get("/eda/churn_by_dept_salary")
def eda_churn_by_dept_salary(top: int = 8):
    df = _load_df_for_eda()
    top_depts = df["department"].value_counts().head(top).index.tolist()

    rows: List[Dict[str, float]] = []
    for dept in top_depts:
        sub = df[df["department"] == dept]

        def rate(sal: str) -> float:
            base = sub[sub["salary"] == sal]
            return float((base["left"].mean() * 100).round(2)) if len(base) else 0.0

        rows.append(
            {
                "name": dept,
                "low": rate("low"),
                "medium": rate("medium"),
                "high": rate("high"),
            }
        )
    return rows
