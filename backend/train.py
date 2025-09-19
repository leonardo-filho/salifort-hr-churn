from pathlib import Path
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier

# ---------- caminhos ----------
BASE_DIR = Path(__file__).parent
DATA = BASE_DIR / "data" / "HR_capstone_dataset.csv"
MODEL_DIR = BASE_DIR / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)
MODEL_PATH = MODEL_DIR / "rf_model.joblib"

# ---------- carga e normalização de colunas ----------
df = pd.read_csv(DATA)
# normaliza nomes para evitar KeyError por capitalização/espaços
df.columns = df.columns.str.strip().str.lower()

# alguns datasets trazem 'time_spend_company' em vez de 'tenure'
if "time_spend_company" in df.columns and "tenure" not in df.columns:
    df = df.rename(columns={"time_spend_company": "tenure"})

# checagem mínima de colunas necessárias
required = {
    "satisfaction_level",
    "last_evaluation",
    "number_project",
    "average_monthly_hours",
    "tenure",
    "work_accident",
    "promotion_last_5years",
    "left",
}
missing = required - set(df.columns)
if missing:
    raise ValueError(f"Colunas obrigatórias ausentes no CSV: {missing}\n"
                     f"Colunas encontradas: {list(df.columns)}")

# categóricas: use as que existirem
cat_cols = [c for c in ["department", "salary"] if c in df.columns]
num_cols = [
    "satisfaction_level",
    "last_evaluation",
    "number_project",
    "average_monthly_hours",
    "tenure",
    "work_accident",
    "promotion_last_5years",
]

X = df[cat_cols + num_cols]
y = df["left"].astype(int)

# ---------- pipeline ----------
pre = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
    ],
    remainder="passthrough",  # mantém as numéricas
)

pipe = Pipeline(
    steps=[
        ("prep", pre),
        (
            "clf",
            RandomForestClassifier(
                n_estimators=300,
                random_state=42,
                n_jobs=-1,
                class_weight="balanced",
            ),
        ),
    ]
)

# ---------- treino / avaliação ----------
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

pipe.fit(X_tr, y_tr)
acc = pipe.score(X_te, y_te)
print(f"Acurácia holdout: {acc:.3f}")

# ---------- salvar ----------
joblib.dump(pipe, MODEL_PATH)
print(f"Modelo salvo em: {MODEL_PATH}")
