from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Escalation(Base):
    __tablename__ = 'escalations'
    id = Column(Integer, primary_key=True)
    issue = Column(String)
    owner = Column(String)
    priority = Column(String)
    status = Column(String)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project')
    escalation_type = Column(String)
    escalation_date = Column(Date)
    resolution_date = Column(Date)
    resolution_status = Column(String)
    escalation_notes = Column(String)
    impact = Column(String)
    severity = Column(String)
    actions_taken = Column(String)
    follow_up = Column(String)
    # UI-required fields
    title = Column(String)
    customer = Column(String)
    project = Column(String)
    dateRaised = Column(String)
    resolutionETA = Column(String)
    description = Column(String)
    riskLevel = Column(String)
