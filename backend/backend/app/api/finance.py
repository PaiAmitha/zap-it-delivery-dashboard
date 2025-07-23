from flask_restful import Resource
from app.models.employee import Employee
from app import db

class FinanceResource(Resource):
    def get(self):
        # Example: Aggregate finance data from Employee model
        total_cost = db.session.query(db.func.sum(Employee.monthly_salary_cost)).scalar() or 0
        total_revenue = db.session.query(db.func.sum(Employee.monthly_revenue_generated)).scalar() or 0
        total_ytd_cost = db.session.query(db.func.sum(Employee.total_ytd_cost)).scalar() or 0
        total_ytd_revenue = db.session.query(db.func.sum(Employee.total_ytd_revenue)).scalar() or 0
        return {
            "totalCost": total_cost,
            "totalRevenue": total_revenue,
            "totalYTDCost": total_ytd_cost,
            "totalYTDRevenue": total_ytd_revenue
        }, 200
