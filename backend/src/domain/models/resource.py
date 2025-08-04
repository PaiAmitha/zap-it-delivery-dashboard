from flask_sqlalchemy import SQLAlchemy
from src.presentation.extensions import db

class Resource(db.Model):
    __tablename__ = 'resources'
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String)
    phone = db.Column(db.String)
    full_name = db.Column(db.String)
    designation = db.Column(db.String)
    department = db.Column(db.String)
    seniority_level = db.Column(db.String)
    experience = db.Column(db.Float)
    location = db.Column(db.String)
    joining_date = db.Column(db.Date)
    employment_type = db.Column(db.String)
    reporting_manager = db.Column(db.String)
    primary_skill = db.Column(db.String)
    skill_category = db.Column(db.String)
    billable_status = db.Column(db.Boolean)
    current_engagement = db.Column(db.String)
    project_name = db.Column(db.String)
    engagement_description = db.Column(db.String)
    engagement_start_date = db.Column(db.Date)
    engagement_end_date = db.Column(db.Date)
    aging_in_non_billable = db.Column(db.Integer)
    current_bench_status = db.Column(db.Boolean)
    engagement_detail = db.Column(db.String)
    is_intern = db.Column(db.Boolean)
    internship_start_date = db.Column(db.Date)
    internship_end_date = db.Column(db.Date)
    assigned_project = db.Column(db.String)
    mentor_name = db.Column(db.String)
    stipend = db.Column(db.Float)
    monthly_salary_cost = db.Column(db.Float)
    billing_rate = db.Column(db.Float)
    monthly_revenue_generated = db.Column(db.Float)
    cost_center = db.Column(db.String)
    total_ytd_cost = db.Column(db.Float)
    total_ytd_revenue = db.Column(db.Float)
    utilization_rate = db.Column(db.Float)
    project_success_rate = db.Column(db.Float)
    performance_rating = db.Column(db.Float)
    skills = db.Column(db.String)
    skillset = db.Column(db.String)
    upcoming_engagements = db.Column(db.String)
    current_projects = db.Column(db.String)
    performance_feedback = db.Column(db.String)
    bench_days = db.Column(db.Integer)
    status = db.Column(db.String)
    reason = db.Column(db.String)
    suggestion = db.Column(db.String)
    monthly_cost = db.Column(db.Float)
    risk_level = db.Column(db.String)
    experience_bucket = db.Column(db.String)
    bench_reason = db.Column(db.String)
    utilization_percentage = db.Column(db.Float)
    productivity_score = db.Column(db.Float)
    last_project_end_date = db.Column(db.Date)
    primary_skills = db.Column(db.String)
    secondary_skills = db.Column(db.String)
    bench_start_date = db.Column(db.Date)
    bench_aging_bucket = db.Column(db.String)
    bench_monthly_cost = db.Column(db.Float)
    bench_avg_daily_cost = db.Column(db.Float)
    bench_risk_level = db.Column(db.String)
    reallocation_opportunity = db.Column(db.Boolean)
    monthly_growth = db.Column(db.Float)
    department_data = db.Column(db.String)
    designation_data = db.Column(db.String)
    location_data = db.Column(db.String)
    monthly_growth_data = db.Column(db.String)
    summary_stats = db.Column(db.String)
    kpi_data = db.Column(db.String)
    productivity_score = db.Column(db.Float)
    client = db.Column(db.String)
    client_allocation = db.Column(db.String)
    utilization_trend = db.Column(db.String)
    performance_trend = db.Column(db.String)
    engagement_options = db.Column(db.String)
    engagement_notes = db.Column(db.String)
    release_date = db.Column(db.Date)
    role = db.Column(db.String)
    project_success_rate = db.Column(db.Float)
    performance_feedback_reviewer = db.Column(db.String)
    performance_feedback_date = db.Column(db.Date)
    performance_feedback_rating = db.Column(db.Float)
    performance_feedback_comment = db.Column(db.String)
    performance_feedback_strengths = db.Column(db.String)
    performance_feedback_improvements = db.Column(db.String)
    performance_feedback_goals = db.Column(db.String)
    last_working_day = db.Column(db.Date)  # Added for resignations tracking

    def to_dict(self):
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        result['employeeId'] = self.employee_id or self.id
        result['fullName'] = self.full_name
        result['email'] = self.email
        result['phone'] = self.phone
        result['skills'] = self.skills.split(',') if self.skills else []
        import json
        # Fix for malformed JSON or stringified arrays
        if self.primary_skills:
            try:
                # Try to parse as JSON array
                parsed = json.loads(self.primary_skills)
                if isinstance(parsed, list):
                    result['primarySkills'] = parsed
                else:
                    result['primarySkills'] = [str(parsed)]
            except Exception:
                # Fallback: split by comma
                result['primarySkills'] = [s.strip() for s in self.primary_skills.split(',') if s.strip()]
        else:
            result['primarySkills'] = []
        result['secondarySkills'] = self.secondary_skills.split(',') if self.secondary_skills else []
        result['seniorityLevel'] = self.seniority_level
        result['experience'] = self.experience
        result['joiningDate'] = str(self.joining_date) if self.joining_date else ''
        result['employmentType'] = self.employment_type
        result['reportingManager'] = self.reporting_manager
        result['billableStatus'] = self.billable_status
        result['currentEngagement'] = self.current_engagement
        result['projectName'] = self.project_name
        result['engagementDescription'] = self.engagement_description
        result['engagementStartDate'] = str(self.engagement_start_date) if self.engagement_start_date else ''
        result['engagementEndDate'] = str(self.engagement_end_date) if self.engagement_end_date else ''
        result['monthlySalaryCost'] = self.monthly_salary_cost
        result['billingRate'] = self.billing_rate
        result['monthlyRevenueGenerated'] = self.monthly_revenue_generated
        result['costCenter'] = self.cost_center
        result['totalYTDCost'] = self.total_ytd_cost
        result['totalYTDRevenue'] = self.total_ytd_revenue
        result['benchDays'] = self.bench_days
        result['benchStartDate'] = str(self.bench_start_date) if self.bench_start_date else ''
        result['is_intern'] = self.is_intern
        result['lastWorkingDay'] = str(self.last_working_day) if self.last_working_day else ''
        return result
