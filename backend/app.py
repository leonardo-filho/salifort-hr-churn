# backend/app.py
from pathlib import Path
from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib

app = FastAPI(title="Salifort HR Churn API", version="1.0")

# (Opcional) CORS – útil para o frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

# Carrega o modelo/pipeline salvo
MODEL_PATH = Path(__file__).parent / "models" / "rf_model.joblib"
model = joblib.load(MODEL_PATH)

# Esquema de entrada
class Employee(BaseModel):
    satisfaction_level: float = Field(..., ge=0, le=1)
    last_evaluation: float = Field(..., ge=0, le=1)
    number_project: int = Field(..., ge=0)
    average_monthly_hours: int = Field(..., ge=0)
    tenure: int = Field(..., ge=0)                 # <-- era time_spend_company
    work_accident: int = Field(..., ge=0, le=1)
    promotion_last_5years: int = Field(..., ge=0, le=1)
    department: str
    salary: str  # "low" | "medium" | "high"
@app.get("/")
def root():
    return {"status": "ok", "message": "API de previsão de rotatividade no ar", "docs": "/docs"}

@app.post("/predict")
def predict(emp: Employee):
    # Converte para DataFrame com mesma estrutura usada no treino
    X = pd.DataFrame([emp.dict()])
    # Como salvamos o pipeline completo, ele trata categorias/escala internamente
    proba = float(model.predict_proba(X)[0, 1])
    pred = int(proba >= 0.5)
    return {
        "left_prediction": pred,
        "probability": round(proba, 4)
    }
