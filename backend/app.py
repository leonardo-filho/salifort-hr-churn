# backend/app.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
from pathlib import Path
import numpy as np
from typing import List, Dict

BASE = Path(__file__).parent
DATA = BASE / "data" / "HR_capstone_dataset.csv"
MODEL = BASE / "models" / "rf_model.joblib"

df = pd.read_csv(DATA)
model = joblib.load(MODEL)

app = FastAPI(title="Salifort HR Churn API", version="1.0.0")

# CORS (ajuste o domínio do seu frontend em produção)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # em prod troque por ["https://seu-dominio"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Tipos p/ predição ----------
class EmployeeFeatures(BaseModel):
    satisfaction_level: float
    last_evaluation: float
    number_project: int
    average_monthly_hours: int
    time_spend_company: int
    work_accident: int
    promotion_last_5years: int
    department: str
    salary: str

# ---------- Endpoints ----------
@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/kpis")
def kpis():
    churn_rate = float((df["left"] == 1).mean())
    avg_hours_by_status = (
        df.groupby("left")["average_monthly_hours"].mean().rename({0:"stayed",1:"left"}).to_dict()
    )
    projects_dist = df["number_project"].value_counts().sort_index().to_dict()

    # Satisfação por faixa
    bins = [0, .3, .6, 1.0]
    labels = ["low","mid","high"]
    sat_bins = pd.cut(df["satisfaction_level"], bins=bins, labels=labels, include_lowest=True)
    sat_out = sat_bins.value_counts().reindex(labels).fillna(0).astype(int).to_dict()

    return {
        "churn_rate": churn_rate,
        "avg_hours_by_status": avg_hours_by_status,
        "projects_dist": projects_dist,
        "satisfaction_bins": sat_out
    }

@app.get("/feature-importance")
def feature_importance():
    # Extrai importance do RF dentro do Pipeline
    rf = model.named_steps["rf"]
    pre = model.named_steps["pre"]
    cat = pre.transformers_[0][2]
    num = pre.transformers_[1][2]

    # pega nomes das features após OneHot
    ohe = pre.named_transformers_["cat"]
    cat_names = list(ohe.get_feature_names_out(cat))
    feature_names = cat_names + list(num)

    imps = rf.feature_importances_
    pairs = sorted(zip(feature_names, imps), key=lambda x: x[1], reverse=True)
    top = [{"feature": f, "importance": float(v)} for f, v in pairs[:15]]
    return {"top_importance": top}

@app.post("/predict")
def predict(item: EmployeeFeatures):
    X = pd.DataFrame([item.model_dump()])
    prob = float(model.predict_proba(X)[0,1])
    pred = int(prob >= 0.5)
    return {"prediction": pred, "probability_left": prob}
