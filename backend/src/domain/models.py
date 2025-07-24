

from sqlalchemy import Column, Integer, String, Float, Boolean, Date, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Association tables for many-to-many relationships
project_resource = Table('project_resource', Base.metadata,
    Column('project_id', Integer, ForeignKey('projects.id')),
    Column('resource_id', Integer, ForeignKey('resources.id'))
)

project_employee = Table('project_employee', Base.metadata,
    Column('project_id', Integer, ForeignKey('projects.id')),
    Column('employee_id', Integer, ForeignKey('employees.id'))
)

class Resource(Base):
    __tablename__ = 'resources'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    primary_skill = Column(String)
    skill_category = Column(String)
    billable_status = Column(Boolean)
    current_engagement = Column(String)
    project_name = Column(String)
    engagement_description = Column(String)
    aging_days = Column(Integer)
    utilization = Column(Float)
    location = Column(String)
    billing_rate = Column(Float)
    availability_date = Column(Date)
    employee_id = Column(Integer, ForeignKey('employees.id'))
    employee = relationship('Employee', back_populates='resources')
    projects = relationship('Project', secondary=project_resource, back_populates='resources')

class Project(Base):
    __tablename__ = 'projects'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    status = Column(String)
    priority = Column(String)
    budget = Column(Float)
    required_skills = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    health_status = Column(String)
    profit_margin = Column(Float)
    utilization_rate = Column(Float)
    resources = relationship('Resource', secondary=project_resource, back_populates='projects')
    employees = relationship('Employee', secondary=project_employee, back_populates='projects')
    escalations = relationship('Escalation', back_populates='project')
    finances = relationship('Finance', back_populates='project')

class Employee(Base):
    __tablename__ = 'employees'
    id = Column(Integer, primary_key=True)
    full_name = Column(String, nullable=False)
    designation = Column(String)
    department = Column(String)
    seniority_level = Column(String)
    years_of_experience = Column(Float)
    location = Column(String)
    joining_date = Column(Date)
    resource_type = Column(String)
    reporting_manager = Column(String)
    primary_skill = Column(String)
    billable_status = Column(Boolean)
    current_engagement = Column(String)
    project_name = Column(String)
    engagement_description = Column(String)
    bench_days = Column(Integer)
    cost_rate = Column(Float)
    billing_rate = Column(Float)
    resources = relationship('Resource', back_populates='employee')
    projects = relationship('Project', secondary=project_employee, back_populates='employees')

class Intern(Base):
    __tablename__ = 'interns'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    duration = Column(String)
    department = Column(String)
    mentor = Column(String)
    conversion_status = Column(String)
    status = Column(String)
    feedback = Column(String)
    education = Column(String)
    stipend = Column(Float)
    conversion_potential = Column(String)
    employee_id = Column(Integer, ForeignKey('employees.id'))
    employee = relationship('Employee')

class Escalation(Base):
    __tablename__ = 'escalations'
    id = Column(Integer, primary_key=True)
    issue = Column(String)
    owner = Column(String)
    priority = Column(String)
    status = Column(String)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project', back_populates='escalations')

class Milestone(Base):
    __tablename__ = 'milestones'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    progress = Column(Integer)
    status = Column(String)
    date = Column(Date)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project')

class Risk(Base):
    __tablename__ = 'risks'
    id = Column(Integer, primary_key=True)
    issue = Column(String)
    owner = Column(String)
    priority = Column(String)
    status = Column(String)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project')

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

class Finance(Base):
    __tablename__ = 'finance'
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project', back_populates='finances')
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
