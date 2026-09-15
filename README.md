# Salifort — People Risk Lab

Produto interativo de análise de rotatividade desenvolvido a partir do capstone do Google Advanced Data Analytics. A experiência conecta exploração de dados, um modelo Random Forest e uma interface orientada à decisão.

[Abrir aplicação](https://leonardo-filho.github.io/salifort-hr-churn/#/dashboard) · [Ver no portfólio](https://leonardo-filho.vercel.app/projects/4)

## O problema

Uma taxa agregada de saída não explica onde agir. O produto organiza a análise em três camadas:

1. **Visão executiva** — tamanho do problema e achados prioritários.
2. **Sinais de saída** — relações entre satisfação, carga, projetos, departamento e remuneração.
3. **Laboratório de risco** — cenários conectados ao modelo preditivo por API.

O conjunto público tem 14.999 registros e taxa histórica de saída de 23,8%.

## Stack

- React 19, TypeScript, Vite e React Router
- Recharts para visualizações responsivas
- FastAPI e modelo Random Forest
- Google Cloud Run para a API
- GitHub Pages para o frontend

O frontend usa carregamento por rota, container queries, View Transitions, estados acessíveis e suporte a `prefers-reduced-motion`. Se a API estiver indisponível, indicadores agregados versionados mantêm a exploração navegável e o modo demonstração é identificado de forma explícita.

## Executar localmente

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

Crie `frontend/.env` com `VITE_API_URL` apontando para a API.

### API

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.app:app --reload
```

Ou execute a imagem usada em produção:

```bash
docker build -t salifort-hr-api -f backend/Dockerfile .
docker run --rm -p 8080:8080 salifort-hr-api
```

## Validação

```bash
cd frontend
npm run lint
npm run build
npm audit
```

O container da API também é validado nos endpoints `/health`, `/dataset/metrics` e `/predict`.

## Limites

Os resultados representam associações no conjunto de treinamento. A previsão deve iniciar uma investigação com contexto humano, nunca automatizar decisões sobre pessoas.
