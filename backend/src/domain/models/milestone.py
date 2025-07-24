from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Milestone(Base):
    __tablename__ = 'milestones'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    progress = Column(Integer)
    status = Column(String)
    date = Column(Date)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project')
    milestone_type = Column(String)
    owner = Column(String)
    completion_date = Column(Date)
    notes = Column(String)
    risk_level = Column(String)
    # Add more fields as needed for analytics/reporting
