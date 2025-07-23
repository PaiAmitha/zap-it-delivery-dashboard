from app import db

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.String(64), primary_key=True)
    project_name = db.Column(db.String(120), nullable=False)
    customer = db.Column(db.String(120), nullable=True)
    health_status = db.Column(db.String(32), nullable=True)
    current_stage = db.Column(db.String(64), nullable=True)
    on_time_percentage = db.Column(db.Integer, nullable=True)
    end_date = db.Column(db.String(32), nullable=True)
    risk_level = db.Column(db.String(32), nullable=True)
    dm_po = db.Column(db.String(120), nullable=True)
    owner_id = db.Column(db.String(64), db.ForeignKey('users.id'), nullable=True)
    employees = db.relationship('Employee', secondary='project_employees', back_populates='projects')

class ProjectEmployee(db.Model):
    __tablename__ = 'project_employees'
    project_id = db.Column(db.String(64), db.ForeignKey('projects.id'), primary_key=True)
    employee_id = db.Column(db.String(64), db.ForeignKey('employees.employee_id'), primary_key=True)
