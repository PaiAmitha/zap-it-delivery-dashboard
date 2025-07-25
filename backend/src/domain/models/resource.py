from sqlalchemy import Column, Integer, String, Float, Boolean, Date, ForeignKey
from .base import Base

class Resource(Base):
    __tablename__ = 'resources'
    id = Column(Integer, primary_key=True)
    employee_id = Column(String) # HR Data Section
    full_name = Column(String)
    designation = Column(String)
    department = Column(String)
    seniority_level = Column(String)
    experience = Column(Float)
    location = Column(String)
    joining_date = Column(Date)
    employment_type = Column(String)
    reporting_manager = Column(String)

    primary_skill = Column(String)
    skill_category = Column(String)
    billable_status = Column(Boolean)
    current_engagement = Column(String)
    project_name = Column(String)
    engagement_description = Column(String)
    engagement_start_date = Column(Date)
    engagement_end_date = Column(Date)
    aging_in_non_billable = Column(Integer)
    current_bench_status = Column(Boolean)
    engagement_detail = Column(String)

    is_intern = Column(Boolean)
    internship_start_date = Column(Date)
    internship_end_date = Column(Date)
    assigned_project = Column(String)
    mentor_name = Column(String)
    stipend = Column(Float)

    monthly_salary_cost = Column(Float)
    billing_rate = Column(Float)
    monthly_revenue_generated = Column(Float)
    cost_center = Column(String)
    total_ytd_cost = Column(Float)
    total_ytd_revenue = Column(Float)

    utilization_rate = Column(Float)
    project_success_rate = Column(Float)
    performance_rating = Column(Float)
    skills = Column(String)
    skillset = Column(String)
    upcoming_engagements = Column(String)
    current_projects = Column(String)
    performance_feedback = Column(String)
    bench_days = Column(Integer)
    status = Column(String)
    reason = Column(String)
    suggestion = Column(String)
    monthly_cost = Column(Float)
    risk_level = Column(String)
    experience_bucket = Column(String)
    # Analytics & Management Fields
    bench_reason = Column(String)
    bench_aging_bucket = Column(String)
    bench_monthly_cost = Column(Float)
    bench_avg_daily_cost = Column(Float)
    bench_risk_level = Column(String)
    reallocation_opportunity = Column(Boolean)
    monthly_growth = Column(Float)
    department_data = Column(String)
    designation_data = Column(String)
    location_data = Column(String)
    monthly_growth_data = Column(String)
    summary_stats = Column(String)
    kpi_data = Column(String)
    productivity_score = Column(Float)
    client = Column(String)
    client_allocation = Column(String)
    utilization_trend = Column(String)
    performance_trend = Column(String)
    engagement_options = Column(String)
    engagement_notes = Column(String)
    release_date = Column(Date)
    role = Column(String)
    project_success_rate = Column(Float)
    performance_feedback_reviewer = Column(String)
    performance_feedback_date = Column(Date)
    performance_feedback_rating = Column(Float)
    performance_feedback_comment = Column(String)
    performance_feedback_strengths = Column(String)
    performance_feedback_improvements = Column(String)
    performance_feedback_goals = Column(String)
    # Relationships
    employee_ref = Column(Integer, ForeignKey('employees.id'))
