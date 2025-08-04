from src.presentation.extensions import db
from src.domain.models.resource import Resource
from src.domain.models.project import Project
from src.domain.models.milestone import Milestone
from src.domain.models.risk import Risk
from src.domain.models.escalation import Escalation
from flask import Flask
import random
import string

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Neeraj%40123@localhost:5432/It_Delivery_Dashboard'
db.init_app(app)

def randstr(n=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=n))

with app.app_context():
    db.drop_all()
    db.create_all()

    # Seed projects
    projects = []
    for i in range(15):
        p = Project(
            name=f"Project{randstr(4)}",
            description="A sample project",
            customer="ClientA",
            category="Development",
            status="Active",
            progress=random.randint(0, 100),
            team_size=random.randint(2, 10),
            team_lead="Lead",
            priority="High",
            budget=round(random.uniform(100000, 500000), 2),
            required_skills="Python,SQL",
            start_date=None,
            end_date=None,
            health_status="Good",
            profit_margin=round(random.uniform(0.1, 0.5), 2),
            utilization_rate=round(random.uniform(0.5, 1.0), 2),
            project_type="Internal",
            client="ClientA",
            sow_value=round(random.uniform(100000, 500000), 2),
            billing_rate=round(random.uniform(1000, 5000), 2),
            actual_cost_to_date=round(random.uniform(50000, 200000), 2),
            billable_resources=random.randint(1, 10),
            non_billable_resources=random.randint(0, 5),
            shadow_resources=random.randint(0, 2),
            monthly_burn=round(random.uniform(10000, 50000), 2),
            projected_completion="",
            net_position=round(random.uniform(0, 100000), 2),
            margin=round(random.uniform(0.1, 0.5), 2),
            department="IT",
            engineering_manager=f"Manager{randstr(3)}",
            required_skills_list="Python,SQL",
            kpis="",
            financial_summary="",
            resource_allocation="",
            engagement_plan="",
            status_detail="",
            priority_level="High",
            velocity_trend="",
            teams="",
            engineering_metrics=""
        )
        db.session.add(p)
        projects.append(p)
    db.session.commit()

    # Seed resources and assign to projects
    for i, p in enumerate(projects):
        for j in range(5):
            r = Resource(
                employee_id=f"EMP{randstr(5)}",
                email=f"user{randstr(4)}@example.com",
                phone=f"+91{random.randint(1000000000,9999999999)}",
                full_name=f"Name{randstr(4)}",
                designation="Developer",
                department="IT",
                seniority_level="Mid",
                experience=round(random.uniform(1, 10), 2),
                location="Remote",
                joining_date=None,
                employment_type="Full-Time",
                reporting_manager="Manager",
                primary_skill="Python",
                skill_category="Backend",
                billable_status=True,
                current_engagement=p.name,
                project_name=str(p.id),
                engagement_description="Development",
                engagement_start_date=None,
                engagement_end_date=None,
                aging_in_non_billable=0,
                current_bench_status=False,
                engagement_detail="Active",
                is_intern=False,
                internship_start_date=None,
                internship_end_date=None,
                assigned_project=p.name,
                mentor_name="Mentor",
                stipend=0.0,
                monthly_salary_cost=round(random.uniform(30000, 100000), 2),
                billing_rate=round(random.uniform(1000, 5000), 2),
                monthly_revenue_generated=round(random.uniform(10000, 50000), 2),
                cost_center="IT",
                total_ytd_cost=round(random.uniform(100000, 500000), 2),
                total_ytd_revenue=round(random.uniform(200000, 800000), 2),
                utilization_rate=round(random.uniform(0.5, 1.0), 2),
                project_success_rate=round(random.uniform(0.5, 1.0), 2),
                performance_rating=round(random.uniform(1, 5), 2),
                skills="Python,SQL",
                skillset="Backend",
                upcoming_engagements="ProjectY",
                current_projects=p.name,
                performance_feedback="Good",
                bench_days=0,
                status="Active",
                reason="",
                suggestion="",
                monthly_cost=round(random.uniform(30000, 100000), 2),
                risk_level="Low",
                experience_bucket="1-3",
                bench_reason="",
                utilization_percentage=round(random.uniform(50, 100), 2),
                productivity_score=round(random.uniform(1, 10), 2),
                last_project_end_date=None,
                primary_skills="Python",
                secondary_skills="SQL",
                bench_start_date=None,
                bench_aging_bucket="",
                bench_monthly_cost=0.0,
                bench_avg_daily_cost=0.0,
                bench_risk_level="",
                reallocation_opportunity=False,
                monthly_growth=round(random.uniform(0, 10), 2),
                department_data="IT",
                designation_data="Developer",
                location_data="Remote",
                monthly_growth_data="",
                summary_stats="",
                kpi_data="",
                client="ClientA",
                client_allocation="",
                utilization_trend="",
                performance_trend="",
                engagement_options="",
                engagement_notes="",
                release_date=None,
                role="Developer",
                performance_feedback_reviewer="",
                performance_feedback_date=None,
                performance_feedback_rating=0.0,
                performance_feedback_comment="",
                performance_feedback_strengths="",
                performance_feedback_improvements="",
                performance_feedback_goals=""
            )
            db.session.add(r)
    db.session.commit()

    # Seed milestones, risks, engineering metrics, and escalations for each project
    for p in projects:
        for j in range(3):
            m = Milestone(
                name=f"Milestone{randstr(4)}",
                description="Milestone desc",
                due_date=None,
                status="Pending",
                project_id=p.id,
                progress=random.randint(0, 100),
                date=None,
                milestone_type="",
                owner="Owner",
                completion_date=None,
                notes="",
                risk_level="Low"
            )
            db.session.add(m)
        for j in range(2):
            rk = Risk(
                title=f"Risk{randstr(4)}",
                description="Risk desc",
                owner="Owner",
                status="Open",
                impact="Medium",
                likelihood="Low",
                mitigation_plan="Plan",
                project_id=p.id,
                issue="",
                priority="Medium",
                risk_type="",
                risk_level="Medium",
                risk_date=None,
                probability="",
                notes=""
            )
            db.session.add(rk)
        # Engineering metrics as JSON string
        metrics = {
            "development": {
                "codeCoverage": random.randint(70, 100),
                "codeQuality": random.randint(70, 100),
                "buildSuccess": random.randint(80, 100),
                "leadTime": random.randint(1, 10)
            },
            "qa": {
                "testCoverage": random.randint(70, 100),
                "passRate": random.randint(80, 100),
                "automationRate": random.randint(50, 100),
                "defectDensity": random.randint(1, 10)
            }
        }
        p.engineering_metrics = str(metrics).replace("'", '"')
        # Seed escalations for each project
        for k in range(2):
            esc = Escalation(
                title=f"Escalation{randstr(4)}",
                description="Issue",
                owner="Owner",
                priority="High",
                status="Open",
                date_raised=None,
                resolution_eta="",
                risk_level="Medium",
                issue="",
                project_id=p.id,
                escalation_type="",
                escalation_date=None,
                resolution_date=None,
                resolution_status="",
                escalation_notes="",
                impact="",
                severity="",
                actions_taken="",
                follow_up=""
            )
            db.session.add(esc)
    db.session.commit()

print('Seeding complete!')
