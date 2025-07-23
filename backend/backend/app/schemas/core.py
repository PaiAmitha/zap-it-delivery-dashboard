from marshmallow import Schema, fields

class PermissionField(fields.Field):
    def _serialize(self, value, attr, obj, **kwargs):
        return value if value else {}
    def _deserialize(self, value, attr, data, **kwargs):
        return value

class UserSchema(Schema):
    id = fields.Str(dump_only=True)
    name = fields.Str(required=True)
    email = fields.Email(required=True)
    role = fields.Str(required=True)
    department = fields.Str()
    avatar = fields.Str(allow_none=True)
    permissions = PermissionField()

class ProjectSchema(Schema):
    id = fields.Str(dump_only=True)
    project_name = fields.Str(required=True)
    customer = fields.Str()
    health_status = fields.Str()
    current_stage = fields.Str()
    on_time_percentage = fields.Int()
    end_date = fields.Str()
    risk_level = fields.Str()
    dm_po = fields.Str()
    owner_id = fields.Str()

class EmployeeSchema(Schema):
    employee_id = fields.Str(dump_only=True)
    full_name = fields.Str(required=True)
    email = fields.Email(required=True)
    designation = fields.Str()
    department = fields.Str()
    location = fields.Str()
    status = fields.Str()
    resource_type = fields.Str()
    experience_level = fields.Str()
    cost_rate = fields.Float()
    billing_rate = fields.Float()
    utilization_percentage = fields.Float()
    productivity_score = fields.Float()
    bench_days = fields.Int()
    last_project_end_date = fields.Str()
    primary_skills = fields.List(fields.Str())
    secondary_skills = fields.List(fields.Str())
    years_of_experience = fields.Float()
    joining_date = fields.Str()
    bench_start_date = fields.Str()
    phone = fields.Str()
    billable_status = fields.Bool()
    utilization_rate = fields.Float()
    project_success_rate = fields.Float()
    performance_rating = fields.Int()
    skills = fields.List(fields.Str())
    # HR Data Section
    employment_type = fields.Str()
    reporting_manager = fields.Str()

    # Resource Management Section
    skill_category = fields.Str()
    current_engagement = fields.Str()
    project_name = fields.Str()
    engagement_description = fields.Str()
    engagement_start_date = fields.Str()
    engagement_end_date = fields.Str()
    aging_in_non_billable = fields.Int()
    current_bench_status = fields.Bool()
    engagement_detail = fields.Str()

    # Intern Section
    is_intern = fields.Bool()
    internship_start_date = fields.Str()
    internship_end_date = fields.Str()
    assigned_project = fields.Str()
    mentor_name = fields.Str()
    stipend = fields.Float()

    # Finance Section
    monthly_salary_cost = fields.Float()
    monthly_revenue_generated = fields.Float()
    cost_center = fields.Str()
    total_ytd_cost = fields.Float()
    total_ytd_revenue = fields.Float()
