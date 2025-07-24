from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class KPI(Base):
    __tablename__ = 'kpis'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    value = Column(Float)
    subtitle = Column(String)
    trend = Column(String)
    icon = Column(String)
    entity_type = Column(String)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project')
    kpi_type = Column(String)
    kpi_category = Column(String)
    kpi_date = Column(Date)
    kpi_notes = Column(String)
    kpi_target = Column(Float)
    kpi_actual = Column(Float)
    kpi_status = Column(String)
    # Add more fields as needed for analytics/reporting
