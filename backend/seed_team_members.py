import random
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.domain.models.project import Project
from src.domain.models.employee import Employee

DATABASE_URL = "postgresql://postgres:Neeraj%40123@localhost:5432/it_delivery_dashboard"

TEAM_MEMBER_DATA = [
    {"name": "Alice", "role": "Team Lead", "experience": 8, "allocation": "100%", "status": "Active", "performance": "Excellent", "department": "Engineering", "location": "Bangalore"},
    {"name": "Bob", "role": "Frontend Developer", "experience": 5, "allocation": "100%", "status": "Active", "performance": "Good", "department": "Engineering", "location": "Bangalore"},
    {"name": "Charlie", "role": "Backend Developer", "experience": 6, "allocation": "100%", "status": "Active", "performance": "Good", "department": "Engineering", "location": "Bangalore"},
    {"name": "David", "role": "QA Engineer", "experience": 4, "allocation": "100%", "status": "Active", "performance": "Average", "department": "QA", "location": "Bangalore"},
    {"name": "Eve", "role": "QA Engineer", "experience": 3, "allocation": "100%", "status": "Active", "performance": "Good", "department": "QA", "location": "Bangalore"}
]

def seed_team_members():
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    projects = session.query(Project).all()
    for project in projects:
        # Remove existing team members for a clean seed
        session.query(Employee).filter(Employee.project_id == project.id).delete()
        for member in TEAM_MEMBER_DATA:
            employee = Employee(
                name=member["name"],
                role=member["role"],
                experience=member["experience"],
                allocation=member["allocation"],
                status=member["status"],
                performance=member["performance"],
                department=member["department"],
                location=member["location"],
                project_id=project.id
            )
            session.add(employee)
    session.commit()
    print(f"Seeded team members for {len(projects)} projects.")
    session.close()

if __name__ == "__main__":
    seed_team_members()
