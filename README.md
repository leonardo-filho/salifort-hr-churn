# 📊 Projeto Capstone: Análise de Rotatividade de Funcionários - Salifort Motors

Este projeto faz parte do **Google Advanced Data Analytics Certificate (Capstone Project)**.  
O objetivo é analisar um conjunto de dados de RH da Salifort Motors para identificar os fatores que mais contribuem para a saída de funcionários e construir um modelo preditivo de rotatividade (churn).

---

## 🚀 Objetivos
- Realizar análise exploratória de dados (EDA) para entender padrões de rotatividade.
- Testar diferentes algoritmos de machine learning (Regressão Logística, Decision Tree, Random Forest, XGBoost).
- Selecionar o modelo final com melhor desempenho para prever a saída de colaboradores.
- Gerar insights para orientar políticas de RH (promoções, carga de trabalho, remuneração).

---

## 🛠️ Estrutura do Repositório
├── data/ # Conjunto de dados utilizado (HR_capstone_dataset.csv)
├── Capstone.ipynb # Notebook principal com análise e modelagem
├── requirements.txt # Dependências do projeto
└── README.md # Documentação do projeto


---

## 📂 Dados
O dataset possui **14.999 linhas** e **10 colunas**, incluindo:
- `satisfaction_level` → nível de satisfação do funcionário (0 a 1)  
- `last_evaluation` → nota da última avaliação de desempenho (0 a 1)  
- `number_project` → número de projetos em que o funcionário atuou  
- `average_monthly_hours` → horas médias trabalhadas por mês  
- `time_spend_company` → anos de empresa  
- `work_accident` → se sofreu acidente de trabalho  
- `promotion_last_5years` → se recebeu promoção nos últimos 5 anos  
- `department` → departamento do funcionário  
- `salary` → faixa salarial (low, medium, high)  
- `left` → se o funcionário deixou a empresa (1 = sim, 0 = não)  

---

## ⚙️ Como rodar o projeto
1. Clone este repositório:
   ```bash
   git clone https://github.com/leonardo-filho/salifort-hr-churn.git
   cd salifort-hr-churn

2. Crie um ambiente virtual:
    ```bash
    python -m venv .venv
    source .venv/bin/activate   # Linux/Mac
    .venv\Scripts\activate      # Windows

3. Instale as dependências:
    ```bash
    pip install -r requirements.txt

4. Abra o Jupyter Notebook:
    ```bash
    jupyter notebook Capstone.ipynb

## 📈 Resultados esperados
>Modelo final: Random Forest, com acurácia aproximada de 88–90%.

    Principais fatores de saída:

    Nível de satisfação baixo

    Carga horária excessiva ou insuficiente

    Falta de promoções ao longo do tempo

    Salário baixo


## ✨ Autor

👤 Leonardo Filho

> Projeto desenvolvido como parte do **Google Advanced Data Analytics Certificate**.


---

### 📄 requirements.txt
```txt
pandas
numpy
matplotlib
seaborn
scikit-learn
xgboost
jupyter