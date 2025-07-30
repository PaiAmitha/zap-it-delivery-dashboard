from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Escalation(Base):
    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    __tablename__ = 'escalations'
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    customer = Column(String)
    project = Column(String)
    owner = Column(String)
    priority = Column(String)
    status = Column(String)
    date_raised = Column(String)
    resolution_eta = Column(String)
    description = Column(String)
    risk_level = Column(String)
    # Optional/extended fields
    issue = Column(String)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project_rel = relationship('Project')
    escalation_type = Column(String)
    escalation_date = Column(Date)
    resolution_date = Column(Date)
    resolution_status = Column(String)
    escalation_notes = Column(String)
    impact = Column(String)
    severity = Column(String)
    actions_taken = Column(String)
    follow_up = Column(String)
