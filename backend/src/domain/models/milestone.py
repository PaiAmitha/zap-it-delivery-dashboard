from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Milestone(Base):
    name = Column(String, nullable=False)
    description = Column(String)
    due_date = Column(String)
    status = Column(String)
    project_id = Column(String)
    __tablename__ = 'milestones'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    progress = Column(Integer)
    status = Column(String)
    date = Column(Date)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project', back_populates='milestones')
    milestone_type = Column(String)
    owner = Column(String)
    completion_date = Column(Date)
    notes = Column(String)
    risk_level = Column(String)
    # Add more fields as needed for analytics/reporting
