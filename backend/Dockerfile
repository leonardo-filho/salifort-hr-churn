# Use a imagem oficial do Python como base
FROM python:3.10-slim

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie o arquivo de dependências para o diretório de trabalho
COPY requirements.txt .

# Instale as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copie o resto do código para o diretório de trabalho
COPY . .

# Exponha a porta que a API usará
EXPOSE 8000

# Comando para iniciar o servidor Uvicorn quando o contêiner for executado
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]