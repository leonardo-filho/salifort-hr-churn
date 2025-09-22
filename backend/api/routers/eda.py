# backend/app/routers/eda.py
from pathlib import Path
from typing import Dict, List, Any, Union
import numpy as np
import pandas as pd
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

# --------- util ---------
# .../backend/api/routers/eda.py  -> subir 2 níveis para chegar em .../backend
BACKEND_DIR = Path(__file__).resolve().parents[2]
DATA_PATH = BACKEND_DIR / "data" / "HR_capstone_dataset.csv"


def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [c.strip().lower() for c in df.columns]
    if "average_montly_hours" in df.columns and "average_monthly_hours" not in df.columns:
        df = df.rename(columns={"average_montly_hours": "average_monthly_hours"})
    if "tenure" not in df.columns and "time_spend_company" in df.columns:
        df = df.rename(columns={"time_spend_company": "tenure"})
    return df

def _load_df() -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH)
    df = _normalize_columns(df)
    # dtypes
    for c in [
        "satisfaction_level","last_evaluation","number_project",
        "average_monthly_hours","tenure","work_accident",
        "promotion_last_5years","left"
    ]:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors="coerce")
    for c in ["department","salary"]:
        if c in df.columns:
            df[c] = df[c].astype(str).str.strip().str.lower()
    df["left"] = df["left"].astype(int)
    return df

# --------- endpoints ---------

@router.get("/satisfaction_hist")
def satisfaction_hist(bins: int = 20) -> List[Dict[str, float]]:
    df = _load_df()
    vals = df["satisfaction_level"].dropna().to_numpy()
    counts, edges = np.histogram(vals, bins=bins, range=(0, 1))
    centers = (edges[:-1] + edges[1:]) / 2
    return [{"name": f"{c:.2f}", "value": int(n)} for c, n in zip(centers, counts)]

@router.get("/top_departments")
def top_departments(top: int = 8) -> List[Dict[str, Union[str, int]]]:
    df = _load_df()

    # Count leavers (left == 1) by department
    # and reset the index, naming the new columns 'name' and 'value'
    vc = (
        df.loc[df["left"] == 1, "department"]
          .value_counts()
          .head(top)
          .reset_index()
    )
    # The default behavior of reset_index() on a series creates two columns:
    # the old index (department) and the new column for counts.
    # The new count column is named 'count' by default in pandas 2.x
    # or the name of the series.
    # We can rename them explicitly.

    vc.columns = ["name", "value"]

    # Serialize to a list of dictionaries
    out = vc.to_dict(orient="records")
    return out

@router.get("/churn_by_satisfaction")
def churn_by_satisfaction(bins: int = 10) -> List[Dict[str, float]]:
    df = _load_df()
    s = df["satisfaction_level"].clip(0, 1)
    cats = pd.cut(s, bins=bins, include_lowest=True)
    out = (
        df.groupby(cats)["left"]
          .mean()
          .reset_index()
          .rename(columns={"left": "value", "satisfaction_level": "name"})
    )
    out["value"] = (out["value"] * 100).round(2)
    out["name"] = out["name"].astype(str)
    return out.to_dict(orient="records")

@router.get("/churn_by_projects")
def churn_by_projects() -> List[Dict[str, float]]:
    df = _load_df()
    out = (
        df.groupby("number_project")["left"]
          .mean()
          .reset_index()
          .rename(columns={"number_project": "name", "left": "value"})
    )
    out["value"] = (out["value"] * 100).round(2)
    out["name"] = out["name"].astype(str)
    return out.to_dict(orient="records")

@router.get("/churn_by_hours")
def churn_by_hours(step: int = 20) -> List[Dict[str, float]]:
    df = _load_df()
    hrs = df["average_monthly_hours"]
    bins = range(int(hrs.min()) // step * step, int(hrs.max()) + step, step)
    cats = pd.cut(hrs, bins=bins, include_lowest=True)
    out = (
        df.groupby(cats)["left"]
          .mean()
          .reset_index()
          .rename(columns={"average_monthly_hours": "name", "left": "value"})
    )
    out["value"] = (out["value"] * 100).round(2)
    out["name"] = out["name"].astype(str)
    return out.to_dict(orient="records")

@router.get("/churn_by_dept_salary")
def churn_by_dept_salary(top: int = 8):
    df = _load_df()
    top_depts = df["department"].value_counts().head(top).index.tolist()

    rows = []
    for dept in top_depts:
        sub = df[df["department"] == dept]
        def rate(sal):
            base = sub[sub["salary"] == sal]
            return float((base["left"].mean() * 100).round(2)) if len(base) else 0.0
        rows.append({"name": dept, "low": rate("low"), "medium": rate("medium"), "high": rate("high")})
    return rows
