from app import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(64), nullable=False)
    department = db.Column(db.String(64), nullable=True)
    avatar = db.Column(db.String(255), nullable=True)
    permissions = db.Column(db.JSON, nullable=True)
    password = db.Column(db.String(255), nullable=False)  # hashed password
    projects = db.relationship('Project', backref='owner', lazy=True)
