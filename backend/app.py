# backend/app.py
from pathlib import Path
from typing import Dict

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# ---------------------------------------------------------
# Configuração básica
# ---------------------------------------------------------
app = FastAPI(title="Salifort HR Churn API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ajuste se precisar restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).parent
DATA_PATH = BASE_DIR / "data" / "HR_capstone_dataset.csv"
MODEL_PATH = BASE_DIR / "models" / "rf_model.joblib"

# Carrega o modelo/pipeline (treinado com 'tenure')
model = joblib.load(MODEL_PATH)


# ---------------------------------------------------------
# Utilitários
# ---------------------------------------------------------
def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Colunas minúsculas e correções de nomes comuns."""
    df = df.copy()
    df.columns = [c.strip().lower() for c in df.columns]

    # conserta typo
    if "average_montly_hours" in df.columns and "average_monthly_hours" not in df.columns:
        df = df.rename(columns={"average_montly_hours": "average_monthly_hours"})

    # alguns datasets trazem time_spend_company; converte para tenure
    if "tenure" not in df.columns and "time_spend_company" in df.columns:
        df = df.rename(columns={"time_spend_company": "tenure"})

    return df


def load_dataset() -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH)
    df = _normalize_columns(df)

    # garante dtypes numéricos onde necessário
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

    # strings normalizadas
    for c in ["department", "salary"]:
        if c in df.columns:
            df[c] = df[c].astype(str).str.strip().str.lower()

    return df


def _to_native(obj):
    """Converte tipos numpy/pandas para nativos (int/float/str)."""
    if isinstance(obj, (pd.Int64Dtype.type,)) or str(type(obj)).endswith("int64'>"):
        return int(obj)
    if isinstance(obj, (pd.Float64Dtype.type,)) or str(type(obj)).endswith("float64'>"):
        return float(obj)
    return obj


def _records_native(rows):
    return [{k: _to_native(v) for k, v in r.items()} for r in rows]


# ---------------------------------------------------------
# Esquema de entrada para previsão
# (alinhado ao treino com 'tenure')
# ---------------------------------------------------------
class Employee(BaseModel):
    satisfaction_level: float = Field(..., ge=0, le=1)
    last_evaluation: float = Field(..., ge=0, le=1)
    number_project: int = Field(..., ge=0)
    average_monthly_hours: int = Field(..., ge=0)
    tenure: int = Field(..., ge=0)  # <-- usado no treino
    work_accident: int = Field(..., ge=0, le=1)
    promotion_last_5years: int = Field(..., ge=0, le=1)
    department: str
    salary: str  # "low" | "medium" | "high"


# ---------------------------------------------------------
# Rotas
# ---------------------------------------------------------
@app.get("/")
def root():
    return {"status": "ok", "message": "API de previsão de rotatividade no ar", "docs": "/docs"}


@app.post("/predict")
def predict(emp: Employee):
    # prepara DataFrame com os MESMOS nomes usados no treino
    payload = emp.dict()
    # normaliza strings como no dataset
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
    return JSONResponse(
        {"rows": rows, "columns": list(df.columns), "count": int(len(df))}
    )


@app.get("/dataset/metrics")
def dataset_metrics():
    df = load_dataset()

    # métricas protegidas contra ausência de colunas
    def _safe_mean(col: str, default: float = 0.0) -> float:
        return float(df[col].mean()) if col in df.columns and len(df[col]) else default

    def _safe_vc(col: str) -> Dict[str, int]:
        return {str(k): int(v) for k, v in df[col].value_counts().sort_index().to_dict().items()} if col in df.columns else {}

    churn_rate = _safe_mean("left")
    avg_hours = _safe_mean("average_monthly_hours")
    avg_projects = _safe_mean("number_project")

    hours_by_left = (
        df.groupby("left")["average_monthly_hours"].mean().to_dict()
        if {"left", "average_monthly_hours"}.issubset(df.columns)
        else {}
    )
    hours_by_left = {("left" if k == 1 else "stayed"): round(float(v), 2) for k, v in hours_by_left.items()}

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
