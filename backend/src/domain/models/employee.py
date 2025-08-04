from ...presentation.extensions import db

class Employee(db.Model):
    __tablename__ = 'employees'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String)
    email = db.Column(db.String)
    phone = db.Column(db.String)
    designation = db.Column(db.String)
    department = db.Column(db.String)
    # ...add more fields as needed for your project flow...
