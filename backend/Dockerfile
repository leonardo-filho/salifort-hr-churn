FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# requirements do backend
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# copia o pacote inteiro "backend" (mantendo backend/api, backend/data, backend/models, etc.)
COPY backend ./backend

# roda via pacote "backend"
CMD ["sh","-c","python -m uvicorn backend.app:app --host 0.0.0.0 --port ${PORT:-8080}"]
