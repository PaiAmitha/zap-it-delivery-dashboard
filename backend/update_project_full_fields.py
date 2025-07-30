import os
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.domain.models.project import Project

DATABASE_URL = "postgresql://postgres:Neeraj%40123@localhost:5432/it_delivery_dashboard"

# Example data for all fields
REAL_TEAMS = json.dumps([
    {"name": "Engineering", "lead": "Alice", "members": ["Bob", "Charlie"]},
    {"name": "QA", "lead": "David", "members": ["Eve"]}
])
REAL_ENGINEERING_METRICS = json.dumps({
    "development": {
        "codeCoverage": 87.5,
        "codeQuality": 92,
        "buildSuccess": 99,
        "deploymentFreq": "Daily",
        "leadTime": "2 days",
        "technicalDebt": 15
    },
    "velocityData": [
        {"sprint": "Sprint 11", "planned": 40, "completed": 38},
        {"sprint": "Sprint 12", "planned": 42, "completed": 42},
        {"sprint": "Sprint 13", "planned": 45, "completed": 43},
        {"sprint": "Sprint 14", "planned": 40, "completed": 41},
        {"sprint": "Sprint 15", "planned": 42, "completed": 40}
    ],
    "codeQualityTrend": [
        {"week": "Week 1", "quality": 85, "coverage": 78, "complexity": 12},
        {"week": "Week 2", "quality": 88, "coverage": 82, "complexity": 11},
        {"week": "Week 3", "quality": 90, "coverage": 84, "complexity": 10},
        {"week": "Week 4", "quality": 92, "coverage": 84, "complexity": 9}
    ],
    "qa": {
        "testCoverage": 78,
        "passRate": 94,
        "automationRate": 85,
        "defectDensity": 2.1
    },
    "defectTrend": [
        {"sprint": "Sprint 11", "found": 15, "fixed": 14, "remaining": 1},
        {"sprint": "Sprint 12", "found": 12, "fixed": 11, "remaining": 2},
        {"sprint": "Sprint 13", "found": 8, "fixed": 9, "remaining": 1},
        {"sprint": "Sprint 14", "found": 10, "fixed": 8, "remaining": 3},
        {"sprint": "Sprint 15", "found": 6, "fixed": 7, "remaining": 2}
    ],
    "defectDistribution": [
        {"type": "UI", "count": 4, "percentage": 22},
        {"type": "Functional", "count": 8, "percentage": 44},
        {"type": "Performance", "count": 2, "percentage": 11},
        {"type": "Security", "count": 1, "percentage": 6},
        {"type": "Integration", "count": 3, "percentage": 17}
    ],
    "testAutomationData": [
        {"category": "Unit Tests", "manual": 20, "automated": 180, "total": 200},
        {"category": "Integration", "manual": 35, "automated": 65, "total": 100},
        {"category": "E2E Tests", "manual": 25, "automated": 35, "total": 60},
        {"category": "API Tests", "manual": 10, "automated": 90, "total": 100}
    ],
    "bugs": 2,
    "deployments": 5,
    "performance": "Excellent",
    "test_coverage": 90,
    "build_success_rate": 99,
    "deployment_frequency": "Daily",
    "mttr": "1 hour",
    "technical_debt": "Low",
    "maintainability": "A",
    "security_score": 95,
    "dependencies_updated": "Current"
})

# Example for all other fields (fill with sample data)
PROJECT_FIELDS = dict(
    name="Project Apollo",
    description="A next-gen platform for analytics.",
    customer="Acme Corp",
    category="Analytics",
    status="On Track",
    progress=80,
    team_size=10,
    team_lead="Alice",
    priority="High",
    budget=1000000.0,
    required_skills="Python,React,SQL",
    start_date="2025-01-01",
    end_date="2025-12-31",
    health_status="Healthy",
    profit_margin=25.5,
    utilization_rate=90.0,
    project_type="Fixed Bid",
    client="Acme Corp",
    sow_value=1200000.0,
    billing_rate=150.0,
    actual_cost_to_date=800000.0,
    billable_resources=8,
    non_billable_resources=2,
    shadow_resources=1,
    monthly_burn=90000.0,
    projected_completion="2025-12-15",
    net_position=200000.0,
    margin=20.0,
    department="Engineering",
    engineering_manager="Bob",
    required_skills_list="Python,React,SQL",
    kpis="{\"velocity\":42,\"quality\":95}",
    financial_summary="{\"revenue\":1000000,\"cost\":800000}",
    resource_allocation="{\"frontend\":4,\"backend\":4,\"qa\":2}",
    engagement_plan="Agile Sprints",
    status_detail="All milestones on track",
    priority_level="P1",
    velocity_trend="Stable",
    code_coverage=87.5,
    performance_score=4.8,
    test_coverage=90.0,
    build_success_rate=99.0,
    deployment_frequency="Daily",
    lead_time="2 days",
    mttr="1 hour",
    technical_debt="Low",
    maintainability="A",
    security_score=95.0,
    dependencies_updated="Current",
    teams=REAL_TEAMS,
    engineering_metrics=REAL_ENGINEERING_METRICS
)

def update_projects():
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    projects = session.query(Project).all()
    for project in projects:
        for k, v in PROJECT_FIELDS.items():
            setattr(project, k, v)
    session.commit()
    print(f"Updated {len(projects)} projects with full sample data.")
    session.close()

if __name__ == "__main__":
    update_projects()
