import os

class Config:
    SQLALCHEMY_DATABASE_URI = (
        'postgresql://postgres:Neeraj@123@localhost:5432/it_delivery_dashboard'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'super-secret-key')
