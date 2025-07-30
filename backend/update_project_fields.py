import os
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.domain.models.project import Project

# Update these values as needed
DATABASE_URL = "postgresql://postgres:Neeraj%40123@localhost:5432/it_delivery_dashboard"

# Example data to update
REAL_TEAMS = json.dumps([
    {"name": "Engineering", "lead": "Alice", "members": ["Bob", "Charlie"]},
    {"name": "QA", "lead": "David", "members": ["Eve"]}
])
REAL_ENGINEERING_METRICS = json.dumps({
    "velocity": 42,
    "code_coverage": 87.5,
    "bugs": 2,
    "deployments": 5
})

def update_projects():
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    projects = session.query(Project).all()
    for project in projects:
        project.teams = REAL_TEAMS
        project.engineering_metrics = REAL_ENGINEERING_METRICS
    session.commit()
    print(f"Updated {len(projects)} projects with real teams and engineering_metrics.")
    session.close()

if __name__ == "__main__":
    update_projects()
