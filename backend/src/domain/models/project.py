from src.presentation.extensions import db

from sqlalchemy.orm import relationship

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    customer = db.Column(db.String)
    category = db.Column(db.String)
    status = db.Column(db.String)
    progress = db.Column(db.Integer)
    team_size = db.Column(db.Integer)
    team_lead = db.Column(db.String)
    priority = db.Column(db.String)
    budget = db.Column(db.Float)
    required_skills = db.Column(db.String)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    health_status = db.Column(db.String)
    profit_margin = db.Column(db.Float)
    utilization_rate = db.Column(db.Float)
    project_type = db.Column(db.String)
    client = db.Column(db.String)
    sow_value = db.Column(db.Float)
    billing_rate = db.Column(db.Float)
    actual_cost_to_date = db.Column(db.Float)
    billable_resources = db.Column(db.Integer)
    non_billable_resources = db.Column(db.Integer)
    shadow_resources = db.Column(db.Integer)
    monthly_burn = db.Column(db.Float)
    projected_completion = db.Column(db.String)
    net_position = db.Column(db.Float)
    margin = db.Column(db.Float)
    department = db.Column(db.String)
    engineering_manager = db.Column(db.String)
    required_skills_list = db.Column(db.String)
    kpis = db.Column(db.String)
    financial_summary = db.Column(db.String)
    resource_allocation = db.Column(db.String)
    engagement_plan = db.Column(db.String)
    status_detail = db.Column(db.String)
    priority_level = db.Column(db.String)
    velocity_trend = db.Column(db.String)
    teams = db.Column(db.String)
    engineering_metrics = db.Column(db.String)
    sprints = relationship('Sprint', back_populates='project', cascade='all, delete-orphan')
    def to_dict(self):
        import json
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for field in ["teams", "engineering_metrics"]:
            val = getattr(self, field, None)
            if val:
                try:
                    result[field] = json.loads(val)
                except Exception:
                    result[field] = val
            else:
                result[field] = None
        return result
