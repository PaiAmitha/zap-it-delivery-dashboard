from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Sprint(Base):
    __tablename__ = 'sprints'
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False)
    sprint_number = Column(Integer, nullable=False)
    name = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    velocity = Column(Float)
    predictability = Column(Float)
    defect_leakage = Column(Float)
    on_time_delivery = Column(Float)
    planned_story_points = Column(Integer)
    completed_story_points = Column(Integer)
    test_cases_executed = Column(Integer)
    test_cases_passed = Column(Integer)
    created_at = Column(Date)
    updated_at = Column(Date)
    # Add more fields as needed for metrics

    project = relationship('Project', back_populates='sprints')
