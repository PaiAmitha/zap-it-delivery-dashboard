from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Risk(Base):
    __tablename__ = 'risks'
    id = Column(Integer, primary_key=True)
    issue = Column(String)
    owner = Column(String)
    priority = Column(String)
    status = Column(String)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project')
    risk_type = Column(String)
    risk_level = Column(String)
    risk_date = Column(Date)
    mitigation_plan = Column(String)
    impact = Column(String)
    probability = Column(String)
    notes = Column(String)
    # Add more fields as needed for analytics/reporting
