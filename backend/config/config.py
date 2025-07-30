import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'postgresql://postgres:Neeraj%40123@localhost:5432/it_delivery_dashboard'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Allow frontend at http://localhost:5173 (Vite default) and http://localhost:8080
    CORS_ORIGINS = ['http://localhost:5173', 'http://localhost:8080']