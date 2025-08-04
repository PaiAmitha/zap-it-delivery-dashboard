import datetime
from src.infrastructure.db import SessionLocal
from src.domain.models import Project, Milestone, Risk, Sprint, TeamMember, EngineeringMetric

def seed_projects():
    db = SessionLocal()
    # Example projects
    projects = [
        Project(
            name="Zenmate Security Platform",
            description="Cybersecurity platform for Zenmate.",
            status="On Track",
            priority="High",
            budget=500000,
            required_skills="Python, Security, DevOps",
            start_date=datetime.date(2025, 1, 1),
            end_date=datetime.date(2025, 12, 31),
            health_status="Good",
            profit_margin=0.25,
            utilization_rate=0.85
        ),
        Project(
            name="TechCorp ERP",
            description="ERP system for TechCorp Inc.",
            status="Critical",
            priority="Critical",
            budget=750000,
            required_skills="Java, SAP, Cloud",
            start_date=datetime.date(2025, 2, 1),
            end_date=datetime.date(2025, 11, 30),
            health_status="Poor",
            profit_margin=0.15,
            utilization_rate=0.65
        ),
        Project(
            name="MedLife Patient Portal",
            description="Patient portal for MedLife Systems.",
            status="At Risk",
            priority="Medium",
            budget=300000,
            required_skills="React, Node.js, Healthcare",
            start_date=datetime.date(2025, 3, 1),
            end_date=datetime.date(2025, 10, 31),
            health_status="Average",
            profit_margin=0.20,
            utilization_rate=0.75
        ),
        Project(
            name="FinanceFruit Mobile Banking",
            description="Mobile banking app for FinanceFruit Bank.",
            status="Delayed",
            priority="High",
            budget=600000,
            required_skills="Flutter, Kotlin, Security",
            start_date=datetime.date(2025, 4, 1),
            end_date=datetime.date(2025, 9, 30),
            health_status="Critical",
            profit_margin=0.10,
            utilization_rate=0.55
        )
    ]
    db.add_all(projects)
    db.commit()
    # Add milestones, risks, sprints, team members, and engineering metrics for each project
    for project in projects:
        db.refresh(project)
        milestones = [
            Milestone(
                name="Kickoff",
                progress=100,
                status="Completed",
                date=datetime.date(2025, 1, 15),
                project_id=project.id
            ),
            Milestone(
                name="Phase 1",
                progress=60,
                status="On Track",
                date=datetime.date(2025, 5, 1),
                project_id=project.id
            )
        ]
        risks = [
            Risk(
                issue="Resource Shortage",
                owner="Manager",
                priority="High",
                status="Open",
                project_id=project.id
            ),
            Risk(
                issue="Tech Debt",
                owner="Tech Lead",
                priority="Medium",
                status="Mitigated",
                project_id=project.id
            )
        ]
        sprints = [
            Sprint(
                sprint_number=1,
                velocity=30,
                predictability=90,
                defect_leakage=2,
                on_time_delivery=95,
                project_id=project.id
            ),
            Sprint(
                sprint_number=2,
                velocity=28,
                predictability=85,
                defect_leakage=3,
                on_time_delivery=90,
                project_id=project.id
            )
        ]
        team_members = [
            TeamMember(
                name="Alice Smith",
                role="Team Lead",
                department="Engineering",
                location="London, UK",
                project_id=project.id
            ),
            TeamMember(
                name="Bob Johnson",
                role="Developer",
                department="Engineering",
                location="London, UK",
                project_id=project.id
            ),
            TeamMember(
                name="Carol Lee",
                role="QA Engineer",
                department="QA",
                location="London, UK",
                project_id=project.id
            )
        ]
        engineering_metric = EngineeringMetric(
            development='{"codeCoverage": 85, "buildSuccessRate": 98, "deploymentFrequency": 5}',
            qa='{"testPassRate": 92, "bugFixRate": 88}',
            project_id=project.id
        )
        db.add_all(milestones)
        db.add_all(risks)
        db.add_all(sprints)
        db.add_all(team_members)
        db.add(engineering_metric)
    db.commit()
    db.close()
    print("Seeded projects, milestones, risks, sprints, team members, and engineering metrics.")

if __name__ == "__main__":
    seed_projects()
