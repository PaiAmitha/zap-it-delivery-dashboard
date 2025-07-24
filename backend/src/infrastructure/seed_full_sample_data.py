from datetime import date
from infrastructure.db import SessionLocal, init_db
from domain.models.employee import Employee
from domain.models.resource import Resource
from domain.models.project import Project
from domain.models.escalation import Escalation
from domain.models.milestone import Milestone
from domain.models.risk import Risk
from domain.models.kpi import KPI
from domain.models.intern import Intern
from domain.models.finance import Finance

init_db()
session = SessionLocal()

## Removed incomplete Employee object and duplicate Project declaration
project1 = Project(
    name="Project Alpha",
    description="API development for TechCorp Industries",
    status="On Track",
    priority="High",
    budget=120000,
    required_skills="Python, Flask, PostgreSQL",
    start_date=date(2024, 5, 1),
    end_date=date(2024, 6, 30),
    health_status="Green",
    profit_margin=0.25,
    utilization_rate=0.85,
    project_type="Development",
    client="TechCorp Industries",
    sow_value=150000,
    billing_rate=18000,
    actual_cost_to_date=90000,
    billable_resources=8,
    non_billable_resources=2,
    shadow_resources=1,
    monthly_burn=20000,
    projected_completion="On Track",
    net_position=60000,
    margin=0.20,
    department="Engineering",
    team_size=10,
    engineering_manager="Sarah Johnson",
    required_skills_list="Python, Flask, PostgreSQL",
    milestones="MVP, UAT, Go-Live",
    risks="Performance, Budget",
    kpis="92% On-Time",
    financial_summary="Healthy",
    resource_allocation="Optimal",
    engagement_plan="Agile Sprints",
    status_detail="On Track",
    priority_level="High",
    velocity_trend="Upward",
    code_coverage=95.0,
    performance_score=4.7,
    test_coverage=90.0,
    build_success_rate=0.98,
    deployment_frequency="Weekly",
    lead_time="2 days",
    mttr="1 hour",
    technical_debt="Low",
    maintainability="High",
    security_score=9.5,
    dependencies_updated="Yes",
    category="Software",
    progress=80,
    teamLead="Sarah Johnson"
)
## Removed all leftover lines from incomplete Employee object

# Resource
resource1 = Resource(
    employee_id="EMP001",
    full_name="John Smith",
    designation="Senior Developer",
    department="Engineering",
    seniority_level="Senior",
    experience=8,
    location="Bangalore",
    joining_date=date(2019, 3, 15),
    employment_type="FTE",
    reporting_manager="Sarah Johnson",
    primary_skill="React.js",
    skill_category="Frontend",
    billable_status=True,
    current_engagement="Project Alpha",
    project_name="Project Alpha",
    engagement_description="Frontend development",
    engagement_start_date=date(2024, 5, 1),
    engagement_end_date=date(2024, 6, 30),
    aging_in_non_billable=0,
    current_bench_status=False,
    engagement_detail="Sprint 1",
    is_intern=False,
    monthly_salary_cost=12000,
    billing_rate=18000,
    monthly_revenue_generated=20000,
    cost_center="ENG01",
    total_ytd_cost=60000,
    total_ytd_revenue=120000,
    utilization_rate=0.85,
    project_success_rate=0.95,
    performance_rating=4.5,
    skills="React.js, Node.js, TypeScript",
    skillset="Frontend",
    upcoming_engagements="Project Beta",
    current_projects="Project Alpha, Project Beta",
    performance_feedback="Excellent work",
    bench_days=0,
    status="active",
    reason="",
    suggestion="Keep up the good work",
    monthly_cost=12000,
    risk_level="Low",
    experience_bucket="Senior",
    bench_reason="",
    bench_aging_bucket="",
    bench_monthly_cost=0,
    bench_avg_daily_cost=0,
    bench_risk_level="Low",
    reallocation_opportunity=False,
    monthly_growth=0.05,
    department_data="Engineering",
    designation_data="Senior Developer",
    location_data="Bangalore",
    monthly_growth_data="0.05",
    summary_stats="Top performer",
    kpi_data="KPI1",
    productivity_score=92,
    client="TechCorp Industries",
    client_allocation="Project Alpha",
    utilization_trend="Upward",
    performance_trend="Stable",
    engagement_options="Full-time",
    engagement_notes="",
    release_date=date(2024, 6, 30),
    role="Developer",
    performance_feedback_reviewer="Sarah Johnson",
    performance_feedback_date=date(2024, 6, 30),
    performance_feedback_rating=4.5,
    performance_feedback_comment="Great job",
    performance_feedback_strengths="Technical skills",
    performance_feedback_improvements="Communication",
    performance_feedback_goals="Lead next sprint",
    # employee_ref removed
)
session.add(resource1)

# Project
project1 = Project(
    name="Project Alpha",
    client="TechCorp Industries",
    health_status="Green",
    # Removed current_stage and on_time_percentage (not in model)
    end_date=date(2024, 6, 30),
    # Removed risk_level, dm_po, owner_id (not in model)
    description="API development for TechCorp Industries",
    status="Active",
    priority="High",
    budget=120000,
    required_skills="Python, Flask, PostgreSQL",
    start_date=date(2024, 5, 1),
    profit_margin=0.25,
    utilization_rate=0.85,
    project_type="Development",
    sow_value=150000,
    billing_rate=18000,
    actual_cost_to_date=90000,
    billable_resources=8,
    non_billable_resources=2,
    shadow_resources=1,
    monthly_burn=20000,
    projected_completion="On Track",
    net_position=60000,
    margin=0.20,
    department="Engineering",
    team_size=10,
    engineering_manager="Sarah Johnson",
    required_skills_list="Python, Flask, PostgreSQL",
    milestones="MVP, UAT, Go-Live",
    risks="Performance, Budget",
    kpis="92% On-Time",
    financial_summary="Healthy",
    resource_allocation="Optimal",
    engagement_plan="Agile Sprints",
    status_detail="On Track",
    priority_level="High",
    velocity_trend="Upward",
    code_coverage=95.0,
    performance_score=4.7,
    test_coverage=90.0,
    build_success_rate=0.98,
    deployment_frequency="Weekly",
    lead_time="2 days",
    mttr="1 hour",
    technical_debt="Low",
    maintainability="High",
    security_score=9.5,
    dependencies_updated="Yes"
)
session.add(project1)

# Escalation
escalation1 = Escalation(
    issue="API Performance Issues",
    owner="Alex Rodriguez",
    priority="High",
    status="Open",
    project_id=project1.id,
    escalation_type="Performance",
    escalation_date=date(2024, 6, 1),
    resolution_date=date(2024, 6, 8),
    resolution_status="Open",
    escalation_notes="Critical performance degradation in API response times affecting customer operations.",
    impact="High",
    severity="Critical",
    actions_taken="Monitoring, Optimization",
    follow_up="Daily standup review",
    # UI fields
    title="API Performance Issues",
    customer="TechCorp Industries",
    project="Project Alpha",
    dateRaised="2024-06-01",
    resolutionETA="2024-06-08",
    description="Critical performance degradation in API response times affecting customer operations."
)
session.add(escalation1)

# Milestone
milestone1 = Milestone(
    name="MVP",
    progress=100,
    status="Completed",
    date=date(2024, 5, 15),
    project_id=1,
    milestone_type="Release",
    owner="Sarah Johnson",
    completion_date=date(2024, 5, 15),
    notes="Initial MVP delivered",
    risk_level="Low"
)
session.add(milestone1)

# Risk
risk1 = Risk(
    issue="Budget Overrun",
    owner="Sarah Johnson",
    priority="Medium",
    status="Open",
    project_id=1,
    risk_type="Financial",
    risk_level="Medium",
    risk_date=date(2024, 5, 20),
    mitigation_plan="Scope review",
    impact="Medium",
    probability="Likely",
    notes="Budget overrun discussion required with client to align on additional scope."
)
session.add(risk1)

# KPI
kpi1 = KPI(
    title="On-Time Delivery",
    value=92.0,
    subtitle="Project Alpha",
    trend="Upward",
    icon="CheckCircle",
    entity_type="Project",
    project_id=1,
    kpi_type="Delivery",
    kpi_category="Schedule",
    kpi_date=date(2024, 6, 30),
    kpi_notes="Project delivered on time",
    kpi_target=90.0,
    kpi_actual=92.0,
    kpi_status="Met"
)
session.add(kpi1)

# Intern
intern1 = Intern(
    employee_id="INT001",
    name="Amit Kumar",
    full_name="Amit Kumar",
    duration="3 months",
    department="Engineering",
    mentor="Sarah Johnson",
    mentor_name="Sarah Johnson",
    conversion_status="Potential",
    conversion_potential="High",
    status="assigned",
    feedback="Quick learner",
    education="B.Tech",
    stipend=15000,
    assigned_project="Project Alpha",
    internship_start_date=date(2024, 5, 1),
    internship_end_date=date(2024, 7, 31),
    monthly_salary_cost=15000,
    billing_rate=0,
    monthly_revenue_generated=0,
    cost_center="ENG01",
    total_ytd_cost=45000,
    total_ytd_revenue=0,
    utilization_rate=0.8,
    performance_rating=4.2,
    skills="Python, Flask",
    skillset="Backend",
    performance_feedback="Great progress",
    status_detail="Active",
    # employee_ref removed
    bench_reason="",
    bench_aging_bucket=""
)
session.add(intern1)

# Finance
finance1 = Finance(
    project_id=1,
    sow_value=150000,
    billing_rate=18000,
    actual_cost_to_date=90000,
    billable_resources=8,
    non_billable_resources=2,
    shadow_resources=1,
    monthly_burn=20000,
    projected_completion="On Track",
    net_position=60000,
    health_status="Green",
    profit_margin=0.25,
    utilization_rate=0.85,
    billable_cost=96000,
    non_billable_cost=24000,
    shadow_cost=12000,
    finance_type="Project",
    finance_category="Development",
    finance_date=date(2024, 6, 30),
    finance_notes="Healthy financials",
    revenue_generated=20000,
    cost_center="ENG01",
    total_ytd_cost=90000,
    total_ytd_revenue=120000
)
session.add(finance1)

session.commit()
session.close()
