from flask_restful import Resource, reqparse
from app.models.employee import Employee
from app.schemas.core import EmployeeSchema
from app import db

employee_schema = EmployeeSchema()
employees_schema = EmployeeSchema(many=True)

class EmployeeListResource(Resource):
    from app.utils.auth import jwt_required
    from app.utils.rbac import permission_required
    @jwt_required
    @permission_required('resources', 'edit')
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('employee_id', required=True)
        parser.add_argument('full_name', required=True)
        parser.add_argument('email', required=True)
        parser.add_argument('designation')
        parser.add_argument('department')
        parser.add_argument('location')
        parser.add_argument('status')
        parser.add_argument('resource_type')
        parser.add_argument('experience_level')
        parser.add_argument('cost_rate', type=float)
        parser.add_argument('billing_rate', type=float)
        parser.add_argument('utilization_percentage', type=float)
        parser.add_argument('productivity_score', type=float)
        parser.add_argument('bench_days', type=int)
        parser.add_argument('last_project_end_date')
        parser.add_argument('primary_skills', type=list, location='json')
        parser.add_argument('secondary_skills', type=list, location='json')
        parser.add_argument('years_of_experience', type=float)
        parser.add_argument('joining_date')
        parser.add_argument('bench_start_date')
        parser.add_argument('phone')
        parser.add_argument('billable_status', type=bool)
        parser.add_argument('utilization_rate', type=float)
        parser.add_argument('project_success_rate', type=float)
        parser.add_argument('performance_rating', type=int)
        parser.add_argument('skills', type=list, location='json')
        # HR
        parser.add_argument('employment_type')
        parser.add_argument('reporting_manager')
        # Resource Management
        parser.add_argument('skill_category')
        parser.add_argument('current_engagement')
        parser.add_argument('project_name')
        parser.add_argument('engagement_description')
        parser.add_argument('engagement_start_date')
        parser.add_argument('engagement_end_date')
        parser.add_argument('aging_in_non_billable', type=int)
        parser.add_argument('current_bench_status', type=bool)
        parser.add_argument('engagement_detail')
        # Intern
        parser.add_argument('is_intern', type=bool)
        parser.add_argument('internship_start_date')
        parser.add_argument('internship_end_date')
        parser.add_argument('assigned_project')
        parser.add_argument('mentor_name')
        parser.add_argument('stipend', type=float)
        # Finance
        parser.add_argument('monthly_salary_cost', type=float)
        parser.add_argument('monthly_revenue_generated', type=float)
        parser.add_argument('cost_center')
        parser.add_argument('total_ytd_cost', type=float)
        parser.add_argument('total_ytd_revenue', type=float)
        args = parser.parse_args()
        employee = Employee(**args)
        db.session.add(employee)
        db.session.commit()
        return employee_schema.dump(employee), 201

    def get(self):
        from flask import request
        query = Employee.query
        # Filtering
        department = request.args.get('department')
        if department:
            query = query.filter(Employee.department == department)
        billable_status = request.args.get('billable_status')
        if billable_status is not None:
            if billable_status.lower() == 'true':
                query = query.filter(Employee.billable_status.is_(True))
            elif billable_status.lower() == 'false':
                query = query.filter(Employee.billable_status.is_(False))
        location = request.args.get('location')
        if location:
            query = query.filter(Employee.location == location)
        # Search
        search = request.args.get('search')
        if search:
            query = query.filter((Employee.full_name.ilike(f"%{search}%")) | (Employee.email.ilike(f"%{search}%")))
        # Pagination
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        return {
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'items': employees_schema.dump(pagination.items)
        }, 200

class EmployeeResource(Resource):
    from app.utils.auth import jwt_required
    from app.utils.rbac import permission_required
    def get(self, employee_id):
        employee = Employee.query.get_or_404(employee_id)
        return employee_schema.dump(employee), 200

    @jwt_required
    @permission_required('resources', 'edit')
    def put(self, employee_id):
        employee = Employee.query.get_or_404(employee_id)
        parser = reqparse.RequestParser()
        # Add all fields as in post
        parser.add_argument('employee_id', required=True)
        parser.add_argument('full_name', required=True)
        parser.add_argument('email', required=True)
        parser.add_argument('designation')
        parser.add_argument('department')
        parser.add_argument('location')
        parser.add_argument('status')
        parser.add_argument('resource_type')
        parser.add_argument('experience_level')
        parser.add_argument('cost_rate', type=float)
        parser.add_argument('billing_rate', type=float)
        parser.add_argument('utilization_percentage', type=float)
        parser.add_argument('productivity_score', type=float)
        parser.add_argument('bench_days', type=int)
        parser.add_argument('last_project_end_date')
        parser.add_argument('primary_skills', type=list, location='json')
        parser.add_argument('secondary_skills', type=list, location='json')
        parser.add_argument('years_of_experience', type=float)
        parser.add_argument('joining_date')
        parser.add_argument('bench_start_date')
        parser.add_argument('phone')
        parser.add_argument('billable_status', type=bool)
        parser.add_argument('utilization_rate', type=float)
        parser.add_argument('project_success_rate', type=float)
        parser.add_argument('performance_rating', type=int)
        parser.add_argument('skills', type=list, location='json')
        # HR
        parser.add_argument('employment_type')
        parser.add_argument('reporting_manager')
        # Resource Management
        parser.add_argument('skill_category')
        parser.add_argument('current_engagement')
        parser.add_argument('project_name')
        parser.add_argument('engagement_description')
        parser.add_argument('engagement_start_date')
        parser.add_argument('engagement_end_date')
        parser.add_argument('aging_in_non_billable', type=int)
        parser.add_argument('current_bench_status', type=bool)
        parser.add_argument('engagement_detail')
        # Intern
        parser.add_argument('is_intern', type=bool)
        parser.add_argument('internship_start_date')
        parser.add_argument('internship_end_date')
        parser.add_argument('assigned_project')
        parser.add_argument('mentor_name')
        parser.add_argument('stipend', type=float)
        # Finance
        parser.add_argument('monthly_salary_cost', type=float)
        parser.add_argument('monthly_revenue_generated', type=float)
        parser.add_argument('cost_center')
        parser.add_argument('total_ytd_cost', type=float)
        parser.add_argument('total_ytd_revenue', type=float)
        args = parser.parse_args()
        for key, value in args.items():
            if value is not None:
                setattr(employee, key, value)
        db.session.commit()
        return employee_schema.dump(employee), 200

    @jwt_required
    @permission_required('resources', 'edit')
    def delete(self, employee_id):
        employee = Employee.query.get_or_404(employee_id)
        db.session.delete(employee)
        db.session.commit()
        return '', 204
