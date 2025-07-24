from datetime import date
from infrastructure.db import SessionLocal, init_db
from domain.models.resource import Resource
from domain.models.project import Project
from domain.models.escalation import Escalation

init_db()
session = SessionLocal()

# Sample Projects
project1 = Project(
    name="Project Alpha",
    description="API development for TechCorp Industries",
    status="Active",
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
    engagement_plan="Agile Sprints"
)
project2 = Project(
    name="Beta Platform",
    description="Platform upgrade for InnovateCorp",
    status="Active",
    priority="Medium",
    budget=90000,
    required_skills="React, Node.js, AWS",
    start_date=date(2024, 4, 1),
    end_date=date(2024, 5, 15),
    health_status="Amber",
    profit_margin=0.18,
    utilization_rate=0.78,
    project_type="Upgrade",
    client="InnovateCorp",
    sow_value=100000,
    billing_rate=15000,
    actual_cost_to_date=70000,
    billable_resources=6,
    non_billable_resources=1,
    shadow_resources=0,
    monthly_burn=15000,
    projected_completion="Delayed",
    net_position=30000,
    margin=0.15,
    department="Engineering",
    team_size=7,
    engineering_manager="Mike Chen",
    required_skills_list="React, Node.js, AWS",
    milestones="Design, UAT, Go-Live",
    risks="Budget, Timeline",
    kpis="78% On-Time",
    financial_summary="Needs Review",
    resource_allocation="Tight",
    engagement_plan="Waterfall"
)
session.add_all([project1, project2])
session.commit()

# Sample Resources
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
    cost_center="ENG01"
)
resource2 = Resource(
    employee_id="EMP002",
    full_name="Priya Sharma",
    designation="QA Lead",
    department="Quality Assurance",
    seniority_level="Mid-Senior",
    experience=5,
    location="Hyderabad",
    joining_date=date(2020, 7, 10),
    employment_type="FTE",
    reporting_manager="Mike Chen",
    primary_skill="QA Automation",
    skill_category="QA",
    billable_status=False,
    current_engagement="Beta Platform",
    project_name="Beta Platform",
    engagement_description="Testing and UAT",
    engagement_start_date=date(2024, 4, 1),
    engagement_end_date=date(2024, 5, 15),
    aging_in_non_billable=45,
    current_bench_status=True,
    engagement_detail="UAT Phase",
    is_intern=False,
    monthly_salary_cost=9000,
    billing_rate=0,
    monthly_revenue_generated=0,
    cost_center="QA01"
)
session.add_all([resource1, resource2])
session.commit()

# Sample Escalations
escalation1 = Escalation(
    issue="API Performance Issues",
    owner="Alex Rodriguez",
    priority="High",
    status="In Progress",
    project_id=project1.id,
    escalation_type="Performance",
    escalation_date=date(2024, 6, 1),
    resolution_date=date(2024, 6, 8),
    resolution_status="Open",
    escalation_notes="Critical performance degradation in API response times affecting customer operations.",
    impact="High",
    severity="Critical",
    actions_taken="Monitoring, Optimization",
    follow_up="Daily standup review"
)
escalation2 = Escalation(
    issue="Budget Overrun Discussion",
    owner="Sarah Johnson",
    priority="Medium",
    status="Resolved",
    project_id=project2.id,
    escalation_type="Budget",
    escalation_date=date(2024, 5, 28),
    resolution_date=date(2024, 6, 5),
    resolution_status="Closed",
    escalation_notes="Budget overrun discussion required with client to align on additional scope.",
    impact="Medium",
    severity="Major",
    actions_taken="Client meeting, Scope review",
    follow_up="Monthly review"
)
session.add_all([escalation1, escalation2])
session.commit()
session.close()
