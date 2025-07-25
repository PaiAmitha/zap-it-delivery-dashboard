from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Finance(Base):
    __tablename__ = 'finance'
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project')
    sow_value = Column(Float)
    billing_rate = Column(Float)
    actual_cost_to_date = Column(Float)
    billable_resources = Column(Integer)
    non_billable_resources = Column(Integer)
    shadow_resources = Column(Integer)
    monthly_burn = Column(Float)
    projected_completion = Column(String)
    net_position = Column(Float)
    health_status = Column(String)
    profit_margin = Column(Float)
    utilization_rate = Column(Float)
    billable_cost = Column(Float)
    non_billable_cost = Column(Float)
    shadow_cost = Column(Float)
    finance_type = Column(String)
    finance_category = Column(String)
    finance_date = Column(Date)
    finance_notes = Column(String)
    revenue_generated = Column(Float)
    cost_center = Column(String)
    total_ytd_cost = Column(Float)
    total_ytd_revenue = Column(Float)
    # Add more fields as needed for analytics/reporting
