
from src.presentation.extensions import db
from sqlalchemy.orm import relationship

class Sprint(db.Model):
    __tablename__ = 'sprints'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    sprint_number = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    velocity = db.Column(db.Float)
    predictability = db.Column(db.Float)
    defect_leakage = db.Column(db.Float)
    on_time_delivery = db.Column(db.Float)
    planned_story_points = db.Column(db.Integer)
    completed_story_points = db.Column(db.Integer)
    test_cases_executed = db.Column(db.Integer)
    test_cases_passed = db.Column(db.Integer)
    created_at = db.Column(db.Date)
    updated_at = db.Column(db.Date)
    # Add more fields as needed for metrics

    project = relationship('Project', back_populates='sprints')
