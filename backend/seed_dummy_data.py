import random
import datetime
from src.domain.models.resource import Resource
from src.domain.models.project import Project
from src.domain.models.sprint import Sprint
from src.domain.models.intern import Intern
from src.domain.models.escalation import Escalation
from src.domain.models.kpi import KPI
from src.presentation.extensions import db
from flask import Flask

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Neeraj%40123@localhost:5432/It_Delivery_Dashboard'  # Match main config
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

    # Delete all existing data
    from src.domain.models.milestone import Milestone
    from src.domain.models.risk import Risk
    db.session.query(KPI).delete()
    db.session.query(Escalation).delete()
    db.session.query(Sprint).delete()
    db.session.query(Intern).delete()
    db.session.query(Resource).delete()
    db.session.query(Milestone).delete()
    db.session.query(Risk).delete()
    db.session.query(Project).delete()
    db.session.commit()

    # Seed Projects
    projects = []
    for i in range(10):
        project = Project(
            name=f"Project {i+1}",
            description=f"Description for Project {i+1}",
            customer=f"Customer {i+1}",
            category=random.choice(["Web", "Mobile", "Data", "Infra"]),
            status=random.choice(["Active", "Completed", "On Hold"]),
            progress=random.randint(0, 100),
            team_size=random.randint(5, 20),
            team_lead=f"Lead {i+1}",
            priority=random.choice(["High", "Medium", "Low"]),
            budget=round(random.uniform(10000, 100000), 2),
            required_skills=", ".join(random.sample(["Python", "React", "SQL", "AWS", "Docker", "Kubernetes"], 3)),
            start_date=datetime.date(2025, 1, 1) + datetime.timedelta(days=i*30),
            end_date=datetime.date(2025, 6, 1) + datetime.timedelta(days=i*30),
            health_status=random.choice(["Green", "Yellow", "Red"]),
            profit_margin=round(random.uniform(5, 30), 2),
            utilization_rate=round(random.uniform(60, 100), 2),
            project_type=random.choice(["Internal", "External"]),
            client=f"Client {i+1}",
            sow_value=round(random.uniform(5000, 50000), 2),
            billing_rate=round(random.uniform(50, 200), 2),
            actual_cost_to_date=round(random.uniform(5000, 50000), 2),
            billable_resources=random.randint(3, 15),
            non_billable_resources=random.randint(1, 5),
            shadow_resources=random.randint(0, 3),
            monthly_burn=round(random.uniform(1000, 10000), 2),
            projected_completion="2025-12-31",
            net_position=round(random.uniform(-5000, 20000), 2),
            margin=round(random.uniform(5, 30), 2),
            department=random.choice(["Engineering", "Finance", "HR"]),
            engineering_manager=f"Manager {i+1}",
            required_skills_list=", ".join(random.sample(["Python", "React", "SQL", "AWS", "Docker", "Kubernetes"], 3)),
            kpis="[]",
            financial_summary="{}",
            resource_allocation="{}",
            engagement_plan="{}",
            status_detail="Healthy",
            priority_level=random.choice(["High", "Medium", "Low"]),
            velocity_trend="Stable",
            teams="[]",
            engineering_metrics="{}"
        )
        db.session.add(project)
        projects.append(project)
    db.session.commit()

    # Seed Resources
    for i in range(50):
        is_intern = False
        intern_fields = {}
        if i % 10 == 0:
            is_intern = True
            intern_fields = {
                'internship_start_date': datetime.date(2025, 1, 1),
                'internship_end_date': datetime.date(2025, 6, 1),
                'stipend': round(random.uniform(5000, 20000), 2),
            }
        resource = Resource(
            employee_id=f"EMP{i+1:03}",
            email=f"employee{i+1}@company.com",
            phone=f"+91-90000{i+1:03}",
            full_name=f"Employee {i+1}",
            designation=random.choice(["Developer", "QA", "Manager", "Intern"]),
            department=random.choice(["Engineering", "Finance", "HR"]),
            seniority_level=random.choice(["Junior", "Mid", "Senior"]),
            experience=round(random.uniform(0.5, 15), 1),
            location=random.choice(["Bangalore", "Mumbai", "Remote"]),
            joining_date=datetime.date(2023, 1, 1) + datetime.timedelta(days=i*10),
            employment_type=random.choice(["Full-Time", "Contract", "Intern"]),
            reporting_manager=f"Manager {random.randint(1,10)}",
            primary_skill=random.choice(["Python", "React", "SQL", "AWS", "Docker", "Kubernetes"]),
            skill_category=random.choice(["Backend", "Frontend", "DevOps"]),
            billable_status=random.choice([True, False]),
            current_engagement=f"Project {random.randint(1,10)}",
            project_name=f"Project {random.randint(1,10)}",
            engagement_description="Working on core modules",
            engagement_start_date=datetime.date(2025, 1, 1),
            engagement_end_date=datetime.date(2025, 6, 1),
            aging_in_non_billable=random.randint(0, 60),
            current_bench_status=random.choice([True, False]),
            engagement_detail="Details about engagement",
            is_intern=is_intern,
            assigned_project=f"Project {random.randint(1,10)}",
            mentor_name=f"Mentor {random.randint(1,10)}",
            monthly_salary_cost=round(random.uniform(30000, 150000), 2),
            billing_rate=round(random.uniform(50, 200), 2),
            monthly_revenue_generated=round(random.uniform(50000, 300000), 2),
            cost_center=random.choice(["CC1", "CC2", "CC3"]),
            total_ytd_cost=round(random.uniform(100000, 500000), 2),
            total_ytd_revenue=round(random.uniform(200000, 800000), 2),
            utilization_rate=round(random.uniform(60, 100), 2),
            project_success_rate=round(random.uniform(70, 100), 2),
            performance_rating=round(random.uniform(1, 5), 2),
            skills=", ".join(random.sample(["Python", "React", "SQL", "AWS", "Docker", "Kubernetes"], 3)),
            skillset=", ".join(random.sample(["Python", "React", "SQL", "AWS", "Docker", "Kubernetes"], 3)),
            upcoming_engagements="[]",
            current_projects="[]",
            performance_feedback="Good performer",
            bench_days=random.randint(0, 60),
            status=random.choice(["Active", "Bench", "Allocated"]),
            reason="Project completed",
            suggestion="Upskill in cloud",
            monthly_cost=round(random.uniform(30000, 150000), 2),
            risk_level=random.choice(["Low", "Medium", "High"]),
            experience_bucket=random.choice(["0-2", "2-5", "5-10", "10+"]),
            bench_reason="Project ended",
            utilization_percentage=round(random.uniform(60, 100), 2),
            last_project_end_date=datetime.date(2025, 6, 1),
            primary_skills=", ".join(random.sample(["Python", "React", "SQL", "AWS", "Docker", "Kubernetes"], 2)),
            secondary_skills=", ".join(random.sample(["Python", "React", "SQL", "AWS", "Docker", "Kubernetes"], 2)),
            bench_start_date=datetime.date(2025, 7, 1),
            bench_aging_bucket=random.choice(["0-30", "31-60", "61-90"]),
            bench_monthly_cost=round(random.uniform(10000, 50000), 2),
            bench_avg_daily_cost=round(random.uniform(500, 2000), 2),
            bench_risk_level=random.choice(["Low", "Medium", "High"]),
            reallocation_opportunity=random.choice([True, False]),
            monthly_growth=round(random.uniform(-5, 10), 2),
            department_data="{}",
            designation_data="{}",
            location_data="{}",
            monthly_growth_data="{}",
            summary_stats="{}",
            kpi_data="{}",
            productivity_score=round(random.uniform(1, 10), 2),
            client=f"Client {random.randint(1,10)}",
            client_allocation="{}",
            utilization_trend="Stable",
            performance_trend="Improving",
            engagement_options="{}",
            engagement_notes="No issues",
            release_date=datetime.date(2025, 12, 31),
            role=random.choice(["Developer", "QA", "Manager", "Intern"]),
            performance_feedback_reviewer=f"Reviewer {random.randint(1,10)}",
            performance_feedback_date=datetime.date(2025, 7, 1),
            performance_feedback_rating=round(random.uniform(1, 5), 2),
            performance_feedback_comment="Consistent performer",
            performance_feedback_strengths="Teamwork, Communication",
            performance_feedback_improvements="Cloud skills",
            performance_feedback_goals="Lead a project",
            last_working_day=datetime.date(2025, 12, 31),
            **intern_fields
        )
        db.session.add(resource)
    db.session.commit()

    # Seed Sprints
    for project in projects:
        for j in range(5):
            sprint = Sprint(
                project_id=project.id,
                sprint_number=j+1,
                name=f"Sprint {j+1} for {project.name}",
                start_date=project.start_date + datetime.timedelta(days=j*14),
                end_date=project.start_date + datetime.timedelta(days=(j+1)*14),
                velocity=round(random.uniform(20, 100), 2),
                predictability=round(random.uniform(70, 100), 2),
                defect_leakage=round(random.uniform(0, 5), 2),
                on_time_delivery=round(random.uniform(80, 100), 2),
                planned_story_points=random.randint(20, 100),
                completed_story_points=random.randint(15, 100),
                test_cases_executed=random.randint(50, 200),
                test_cases_passed=random.randint(40, 200),
                created_at=datetime.date(2025, 1, 1),
                updated_at=datetime.date(2025, 12, 31)
            )
            db.session.add(sprint)
    db.session.commit()

    # Seed Interns
    for i in range(10):
        intern = Intern(
            employee_id=f"INT{i+1:03}",
            name=f"Intern {i+1}",
            full_name=f"Intern {i+1} Fullname",
            email=f"intern{i+1}@company.com",
            phone=f"+91-80000{i+1:03}",
            duration="6 months",
            department=random.choice(["Engineering", "Finance", "HR"]),
            mentor=f"Mentor {random.randint(1,10)}",
            mentor_name=f"Mentor {random.randint(1,10)}",
            conversion_status=random.choice(["Converted", "Not Converted"]),
            conversion_potential=random.choice(["High", "Medium", "Low"]),
            status=random.choice(["Active", "Completed"]),
            feedback="Excellent",
            education=random.choice(["B.Tech", "MCA", "MBA"]),
            stipend=round(random.uniform(5000, 20000), 2),
            assigned_project=f"Project {random.randint(1,10)}",
            internship_start_date=datetime.date(2025, 1, 1),
            internship_end_date=datetime.date(2025, 6, 1),
            monthly_salary_cost=round(random.uniform(10000, 30000), 2),
            billing_rate=round(random.uniform(50, 200), 2),
            monthly_revenue_generated=round(random.uniform(10000, 50000), 2),
            cost_center=random.choice(["CC1", "CC2", "CC3"]),
            total_ytd_cost=round(random.uniform(50000, 200000), 2),
            total_ytd_revenue=round(random.uniform(100000, 400000), 2),
            utilization_rate=round(random.uniform(60, 100), 2),
            performance_rating=round(random.uniform(1, 5), 2),
            skills=", ".join(random.sample(["Python", "React", "SQL", "AWS", "Docker", "Kubernetes"], 3)),
            skillset=", ".join(random.sample(["Python", "React", "SQL", "AWS", "Docker", "Kubernetes"], 3)),
            performance_feedback="Great potential",
            status_detail="Active",
            bench_reason="N/A",
            bench_aging_bucket="0-30",
            bench_monthly_cost=round(random.uniform(1000, 5000), 2),
            bench_avg_daily_cost=round(random.uniform(100, 500), 2),
            bench_risk_level=random.choice(["Low", "Medium", "High"]),
            reallocation_opportunity=random.choice([True, False]),
            monthly_growth=round(random.uniform(-5, 10), 2),
            department_data="{}",
            designation_data="{}",
            location_data="{}",
            monthly_growth_data="{}",
            summary_stats="{}",
            kpi_data="{}",
            productivity_score=round(random.uniform(1, 10), 2),
            client=f"Client {random.randint(1,10)}",
            university=random.choice(["IIT", "NIT", "BITS"]),
            start_date="2025-01-01",
            end_date="2025-06-01",
            location=random.choice(["Bangalore", "Mumbai", "Remote"]),
            seniority_level="Intern",
            is_intern=True
        )
        db.session.add(intern)
    db.session.commit()

    # Seed Escalations
    for project in projects:
        for i in range(2):
            escalation = Escalation(
                title=f"Escalation {i+1} for {project.name}",
                customer=project.customer,
                project=project.name,
                owner=f"Owner {i+1}",
                priority=random.choice(["High", "Medium", "Low"]),
                status=random.choice(["Open", "Closed", "In Progress"]),
                date_raised="2025-08-01",
                resolution_eta="2025-08-15",
                description="Issue description",
                risk_level=random.choice(["Low", "Medium", "High"]),
                issue="Issue details",
                project_id=project.id,
                escalation_type=random.choice(["Technical", "Process", "Resource"]),
                escalation_date=datetime.date(2025, 8, 1),
                resolution_date=datetime.date(2025, 8, 15),
                resolution_status=random.choice(["Resolved", "Pending"]),
                escalation_notes="Notes about escalation",
                impact=random.choice(["Low", "Medium", "High"]),
                severity=random.choice(["Low", "Medium", "High"]),
                actions_taken="Actions taken",
                follow_up="Follow up actions"
            )
            db.session.add(escalation)
    db.session.commit()

    # Seed Milestones
    for project in projects:
        for i in range(3):
            milestone = Milestone(
                name=f"Milestone {i+1} for {project.name}",
                description=f"Milestone {i+1} description for {project.name}",
                due_date=str(project.end_date - datetime.timedelta(days=(3-i)*15)),
                status=random.choice(["Pending", "Completed", "In Progress"]),
                project_id=project.id,
                progress=random.randint(0, 100),
                date=project.start_date + datetime.timedelta(days=i*30),
                milestone_type=random.choice(["Delivery", "Review", "Payment"]),
                owner=f"Owner {i+1}",
                completion_date=project.start_date + datetime.timedelta(days=(i+1)*30),
                notes=f"Notes for milestone {i+1}",
                risk_level=random.choice(["Low", "Medium", "High"])
            )
            db.session.add(milestone)
    db.session.commit()

    # Seed Risks
    for project in projects:
        for i in range(2):
            risk = Risk(
                title=f"Risk {i+1} for {project.name}",
                description=f"Risk {i+1} description for {project.name}",
                owner=f"Owner {i+1}",
                status=random.choice(["Open", "Closed", "Mitigated"]),
                impact=random.choice(["Low", "Medium", "High"]),
                likelihood=random.choice(["Low", "Medium", "High"]),
                mitigation_plan=f"Mitigation plan for risk {i+1}",
                project_id=project.id,
                issue=f"Issue for risk {i+1}",
                priority=random.choice(["High", "Medium", "Low"]),
                risk_type=random.choice(["Technical", "Resource", "Process"]),
                risk_level=random.choice(["Low", "Medium", "High"]),
                risk_date=project.start_date + datetime.timedelta(days=i*20),
                probability=random.choice(["Low", "Medium", "High"]),
                notes=f"Notes for risk {i+1}"
            )
            db.session.add(risk)
    db.session.commit()

    # Seed KPIs
    for project in projects:
        for i in range(5):
            kpi = KPI(
                name=f"KPI {i+1} for {project.name}",
                value=round(random.uniform(50, 100), 2),
                target=100.0,
                status=random.choice(["On Track", "Behind", "Ahead"]),
                description="KPI description",
                project_id=project.id,
                title=f"KPI Title {i+1}",
                subtitle=f"KPI Subtitle {i+1}",
                trend=random.choice(["Up", "Down", "Stable"]),
                icon="icon.png",
                entity_type="Project",
                kpi_type=random.choice(["Efficiency", "Quality", "Delivery"]),
                kpi_category=random.choice(["Engineering", "Finance", "HR"]),
                kpi_date=datetime.date(2025, 8, 1),
                kpi_notes="Notes about KPI",
                kpi_target=100.0,
                kpi_actual=round(random.uniform(50, 100), 2),
                kpi_status=random.choice(["Good", "Average", "Poor"])
            )
            db.session.add(kpi)
    db.session.commit()

print("Dummy data seeded successfully.")
