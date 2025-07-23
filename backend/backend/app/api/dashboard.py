from flask_restful import Resource
from app.models.project import Project
from app.models.employee import Employee
from app.api.escalation import Escalation
from app import db

class DashboardResource(Resource):
    def get(self):
        # KPIs
        active_projects = Project.query.count()
        on_track = Project.query.filter_by(health_status='Green').count()
        at_risk = Project.query.filter(Project.health_status.in_(['Amber', 'Red'])).count()
        escalations = Escalation.query.count()

        # Resource Overview
        total_engineers = Employee.query.count()
        bench_percentage = db.session.query(Employee).filter_by(current_bench_status=True).count() / max(total_engineers, 1) * 100
        allocation_percentage = db.session.query(Employee).filter_by(billable_status=True).count() / max(total_engineers, 1) * 100
        # Role Distribution
        roles = db.session.query(Employee.designation, db.func.count(Employee.employee_id)).group_by(Employee.designation).all()
        role_distribution = [
            {"role": r[0], "count": r[1], "percentage": (r[1]/total_engineers)*100 if total_engineers else 0}
            for r in roles if r[0]
        ]
        # Experience Distribution
        experience = db.session.query(Employee.experience_level, db.func.count(Employee.employee_id)).group_by(Employee.experience_level).all()
        experience_distribution = [
            {"level": e[0], "count": e[1], "percentage": (e[1]/total_engineers)*100 if total_engineers else 0}
            for e in experience if e[0]
        ]
        # Billable Ratio
        billable = db.session.query(Employee).filter_by(billable_status=True).count()
        non_billable = db.session.query(Employee).filter_by(billable_status=False).count()
        billable_percentage = (billable / max(total_engineers, 1)) * 100

        return {
            "kpis": [
                {"id": "active-projects", "title": "Active Projects", "value": active_projects},
                {"id": "on-track", "title": "On Track", "value": on_track},
                {"id": "at-risk", "title": "At Risk", "value": at_risk},
                {"id": "escalations", "title": "Escalations", "value": escalations}
            ],
            "resourceOverview": {
                "totalEngineers": total_engineers,
                "benchPercentage": bench_percentage,
                "allocationPercentage": allocation_percentage,
                "roleDistribution": role_distribution,
                "experienceDistribution": experience_distribution,
                "billableRatio": {
                    "billable": billable,
                    "nonBillable": non_billable,
                    "billablePercentage": billable_percentage
                }
            }
        }, 200
