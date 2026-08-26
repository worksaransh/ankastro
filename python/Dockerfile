FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY python/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY python /app/python

EXPOSE 8000

CMD ["uvicorn", "python.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
