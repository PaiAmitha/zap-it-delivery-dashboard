from sqlalchemy import Column, Integer, String, Float, Date
from sqlalchemy.orm import relationship
from .base import Base

class Project(Base):
    def to_dict(self):
        import json
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        # Parse teams and engineering_metrics as JSON if possible
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
    teams = Column(String)  # JSON or comma-separated list of teams
    engineering_metrics = Column(String)  # JSON string for engineering metrics
    __tablename__ = 'projects'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    customer = Column(String)
    category = Column(String)
    status = Column(String)  # On Track, At Risk, Critical, Delayed
    progress = Column(Integer)
    team_size = Column(Integer)
    team_lead = Column(String)
    priority = Column(String)
    budget = Column(Float)
    required_skills = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    health_status = Column(String)
    profit_margin = Column(Float)
    utilization_rate = Column(Float)
    project_type = Column(String)
    client = Column(String)
    sow_value = Column(Float)
    billing_rate = Column(Float)
    actual_cost_to_date = Column(Float)
    billable_resources = Column(Integer)
    non_billable_resources = Column(Integer)
    shadow_resources = Column(Integer)
    monthly_burn = Column(Float)
    projected_completion = Column(String)
    net_position = Column(Float)
    margin = Column(Float)
    department = Column(String)
    engineering_manager = Column(String)
    required_skills_list = Column(String)
    kpis = Column(String)
    financial_summary = Column(String)
    resource_allocation = Column(String)
    engagement_plan = Column(String)
    status_detail = Column(String)
    priority_level = Column(String)
    velocity_trend = Column(String)
    code_coverage = Column(Float)
    performance_score = Column(Float)
    test_coverage = Column(Float)
    build_success_rate = Column(Float)
    deployment_frequency = Column(String)
    lead_time = Column(String)
    mttr = Column(String)
    technical_debt = Column(String)
    maintainability = Column(String)
    security_score = Column(Float)
    dependencies_updated = Column(String)

    # Relationships (assumes related models exist and are imported)
    milestones = relationship('Milestone', back_populates='project', cascade='all, delete-orphan')
    risks = relationship('Risk', back_populates='project', cascade='all, delete-orphan')
    sprints = relationship('Sprint', back_populates='project', cascade='all, delete-orphan')

# Ensure Sprint is imported so SQLAlchemy can resolve the relationship
from .sprint import Sprint
