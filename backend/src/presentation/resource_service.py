from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from src.domain.models import Resource
from src.presentation.extensions import db

resource_bp = Blueprint('resources', __name__)

@resource_bp.route('/api/interns/<int:id>', methods=['DELETE'])
@cross_origin()
def delete_intern(id):
    from src.domain.models.intern import Intern
    intern = Intern.query.filter_by(id=id).first()
    if not intern:
        return jsonify({'error': 'Intern not found'}), 404
    db.session.delete(intern)
    db.session.commit()
    return jsonify({'message': 'Intern deleted'})

# Resignations endpoint for resource management
@resource_bp.route('/resignations', methods=['GET'])
@cross_origin()
def get_resignations():
    from datetime import datetime, timedelta
    today = datetime.today().date()
    two_months_later = today + timedelta(days=60)
    # Query resources whose last working day is within the next 2 months
    resources = Resource.query.filter(Resource.last_working_day != None).all()
    resignations = []
    for r in resources:
        try:
            lwd = r.last_working_day
            if isinstance(lwd, str):
                lwd_date = datetime.strptime(lwd, "%Y-%m-%d").date()
            else:
                lwd_date = lwd
            if today <= lwd_date <= two_months_later:
                resource_dict = r.to_dict()
                resource_dict["last_working_day"] = lwd_date.strftime("%Y-%m-%d")
                # Ensure employeeId is present and resourceId is not used in its place
                resource_dict["employeeId"] = r.employee_id or r.id
                resignations.append(resource_dict)
        except Exception as e:
            continue
    return jsonify({"resignations": resignations})

@resource_bp.route('/resources/<string:employeeId>', methods=['GET'])
@cross_origin()
def get_resource_by_employee_id(employeeId):
    print(f"DEBUG: Received employeeId param: {employeeId}")
    resource = Resource.query.filter_by(employee_id=employeeId).first()
    print(f"DEBUG: Resource found: {resource}")
    if not resource:
        return jsonify({'error': f'Resource not found for employeeId {employeeId}'}), 404
    resource_dict = resource.to_dict()
    resource_dict['employeeId'] = resource.employee_id
    resource_dict['resourceId'] = resource.resource_id
    print(f"DEBUG: Resource dict returned: {resource_dict}")
    return jsonify({'resource': resource_dict})



@resource_bp.route('/resources', methods=['GET'])
@cross_origin()
def list_resources():
    try:
        seniority = request.args.get('seniority')
        billable = request.args.get('billable')
        query = Resource.query
        if seniority:
            query = query.filter(Resource.seniorityLevel.ilike(seniority))
        if billable == 'true':
            query = query.filter(Resource.billableStatus == True)
        all_resources = query.all()
        print('DEBUG: All resources from DB:', [(getattr(r, 'employee_id', None), getattr(r, 'resource_id', None), getattr(r, 'monthlySalaryCost', None)) for r in all_resources])
        resources = [r for r in all_resources if hasattr(r, 'employee_id') and r.employee_id]
        mapped_resources = [dict(r.to_dict(), employeeId=r.employee_id) for r in resources]
        for r in mapped_resources:
            print(f"DEBUG: Resource in API response: employeeId={r.get('employeeId')}, monthlySalaryCost={r.get('monthlySalaryCost')}")
            if 'status' in r:
                del r['status']
        return jsonify({
            'resources': mapped_resources,
            'total_resources': len(mapped_resources),
            'non_billable_resources': len([r for r in mapped_resources if not r['billableStatus']]),
            'intern_resources': len([r for r in mapped_resources if r['is_intern']])
        })
    except Exception as e:
        print('ERROR in list_resources:', str(e))
        return jsonify({'error': 'Failed to fetch resources', 'details': str(e)}), 500

@resource_bp.route('/resources', methods=['POST'])
@cross_origin()
def add_resource():
    data = request.json
    # Convert all camelCase keys to snake_case for SQLAlchemy compatibility
    import re
    def camel_to_snake(name):
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
        return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

    mapped_data = {}
    for k, v in data.items():
        snake_key = camel_to_snake(k)
        mapped_data[snake_key] = None if v == "" else v

    # Validate required fields for Resource
    if not mapped_data.get('employee_id'):
        return jsonify({'error': 'employeeId is required to create a resource.'}), 400

    # Check if this is an intern (by is_intern flag or intern-specific fields)
    is_intern = mapped_data.get('is_intern') or 'education' in mapped_data or 'conversion_potential' in mapped_data
    if is_intern:
        from src.domain.models.intern import Intern
        intern = Intern(**mapped_data)
        db.session.add(intern)
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            if hasattr(e, 'orig') and 'duplicate key value violates unique constraint' in str(e.orig):
                return jsonify({'error': 'An intern with this employeeId already exists.'}), 409
            return jsonify({'error': 'Failed to add intern', 'details': str(e)}), 500
        intern_dict = intern.__dict__.copy()
        intern_dict.pop('_sa_instance_state', None)
        intern_dict['employeeId'] = intern.employee_id
        intern_dict['internId'] = intern.id
        return jsonify({'message': 'Intern added', 'intern': intern_dict}), 201
    else:
        resource = Resource(**mapped_data)
        db.session.add(resource)
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            if hasattr(e, 'orig') and 'duplicate key value violates unique constraint' in str(e.orig):
                return jsonify({'error': 'A resource with this employeeId already exists.'}), 409
            return jsonify({'error': 'Failed to add resource', 'details': str(e)}), 500
        resource_dict = resource.to_dict()
        resource_dict['employeeId'] = resource.employee_id
        resource_dict['resourceId'] = getattr(resource, 'resource_id', None)
        return jsonify({'message': 'Resource added', 'resource': resource_dict}), 201

@resource_bp.route('/resources/<int:id>', methods=['PUT'])
@cross_origin()
def edit_resource(id):
    data = request.json
    # Convert camelCase keys to snake_case for SQLAlchemy compatibility
    import re
    def camel_to_snake(name):
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
        return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()
    mapped_data = {}
    for k, v in data.items():
        snake_key = camel_to_snake(k)
        # Convert empty strings to None for DB compatibility
        mapped_data[snake_key] = None if v == "" else v
    resource = Resource.query.filter_by(id=id).first()
    if not resource:
        return jsonify({'error': 'Resource not found'}), 404
    for key, value in mapped_data.items():
        setattr(resource, key, value)
    db.session.commit()
    resource_dict = resource.to_dict()
    resource_dict['employeeId'] = resource.employee_id
    resource_dict['resourceId'] = getattr(resource, 'resource_id', None) or getattr(resource, 'id', None)
    print(f"DEBUG: Resource updated, DB value monthly_salary_cost={getattr(resource, 'monthlySalaryCost', None)}")
    print(f"DEBUG: Resource dict returned after update: {resource_dict}")
    return jsonify({'message': 'Resource updated', 'resource': resource_dict})

@resource_bp.route('/resources/<int:id>', methods=['DELETE'])
@cross_origin()
def delete_resource(id):
    resource = Resource.query.filter_by(id=id).first()
    if not resource:
        return jsonify({'error': 'Resource not found'}), 404
    db.session.delete(resource)
    db.session.commit()
    return jsonify({'message': 'Resource deleted'})

@resource_bp.route('/resources/analytics/kpi-counts', methods=['GET'])
@cross_origin()
def kpi_counts():
    resources = Resource.query.all()
    total = len(resources)
    billable = len([r for r in resources if r.billableStatus])
    non_billable = len([r for r in resources if not r.billableStatus and not r.is_intern])
    intern = len([r for r in resources if r.is_intern])
    return jsonify({'resourceCounts': {
        'total': total,
        'billable': billable,
        'nonBillable': non_billable,
        'intern': intern
    }})

@resource_bp.route('/resources/analytics/seniority', methods=['GET'])
@cross_origin()
def seniority_analytics():
    from collections import Counter
    resources = Resource.query.all()
    counts = Counter([r.seniorityLevel for r in resources if r.seniorityLevel])
    data = [{'seniority': k, 'count': v} for k, v in counts.items()]
    return jsonify({'data': data})

@resource_bp.route('/resources/analytics/skills', methods=['GET'])
@cross_origin()
def skill_analytics():
    from collections import Counter
    resources = Resource.query.all()
    skills = []
    for r in resources:
        skills.extend(r.skills if isinstance(r.skills, list) else (r.skills.split(',') if r.skills else []))
    counts = Counter(skills)
    data = [{'skill': k, 'count': v} for k, v in counts.items()]
    return jsonify({'data': data})


@resource_bp.route('/resources/upcoming-releases', methods=['GET'])
@cross_origin()
def upcoming_releases():
    from datetime import datetime, timedelta
    today = datetime.today().date()
    two_months_later = today + timedelta(days=62)
    resources = Resource.query.all()
    releases = []
    for r in resources:
        release_date = None
        if hasattr(r, 'engagementEndDate') and r.engagementEndDate:
            release_date = r.engagementEndDate
        if release_date and today <= release_date <= two_months_later:
            releases.append({
                'resourceId': r.resource_id,
                'name': r.fullName,
                'releaseDate': release_date.isoformat(),
                'currentProject': r.currentEngagement,
                'skills': r.skills if isinstance(r.skills, list) else (r.skills.split(',') if r.skills else []),
            })
    return jsonify({'releases': releases})

@resource_bp.route('/resources/interns', methods=['GET'])
@cross_origin()
def intern_management():
    from src.domain.models.intern import Intern
    interns = Intern.query.all()
    def intern_to_dict(intern):
        return {
            'employeeId': intern.employee_id,
            'fullName': intern.full_name or intern.name,
            'name': intern.name,
            'email': intern.email,
            'phone': intern.phone,
            'department': intern.department,
            'mentorName': intern.mentor_name,
            'status': intern.status,
            'stipend': intern.stipend,
            'internshipStartDate': str(intern.internship_start_date) if intern.internship_start_date else '',
            'internshipEndDate': str(intern.internship_end_date) if intern.internship_end_date else '',
            'conversionPotential': intern.conversion_potential,
            'education': intern.education,
            'assignedProject': intern.assigned_project,
            'seniorityLevel': intern.seniority_level,
            'is_intern': intern.is_intern,
        }
    return jsonify({'interns': [intern_to_dict(r) for r in interns]})

@resource_bp.route('/resources/allocate-project', methods=['POST'])
@cross_origin()
def allocate_project():
    data = request.json
    project_id = data.get('project_id')
    skills = data.get('skills', [])
    seniority = data.get('seniority')
    resources = Resource.query.all()
    matches = [r for r in resources if set(skills).intersection(r.skills if isinstance(r.skills, list) else (r.skills.split(',') if r.skills else [])) and r.seniorityLevel == seniority]
    # Simulate allocation: update currentEngagement
    for r in matches:
        r.currentEngagement = project_id
    db.session.commit()
    return jsonify({'allocated_resources': [r.to_dict() for r in matches]})


@resource_bp.route('/resources/resignations', methods=['GET'])
@cross_origin()
def resignations():
    from datetime import datetime
    today = datetime.today().date()
    resources = Resource.query.all()
    resignations = []
    for r in resources:
        if hasattr(r, 'lastWorkingDay') and r.lastWorkingDay:
            last_day = r.lastWorkingDay
            if last_day >= today:
                resignations.append({
                    'resourceId': r.resource_id,
                    'name': r.fullName,
                    'lastWorkingDay': last_day.isoformat(),
                    'status': 'Resigned',
                })
    return jsonify({'resignations': resignations})

@resource_bp.route('/resources/<int:id>', methods=['GET'])
@cross_origin()
def get_resource_by_id(id):
    try:
        resource = Resource.query.filter_by(id=id).first()
        if not resource:
            print(f"ERROR: Resource not found for id {id}")
            return jsonify({'error': f'Resource not found for id {id}'}), 404
        resource_dict = resource.to_dict()
        resource_dict['employeeId'] = getattr(resource, 'employee_id', None)
        resource_dict['resourceId'] = getattr(resource, 'resource_id', None) or getattr(resource, 'id', None)
        print(f"DEBUG: Resource dict for id {id}: {resource_dict}")
        return jsonify({'resource': resource_dict})
    except Exception as e:
        print(f"ERROR in get_resource_by_id: {e}")
        return jsonify({'error': 'Failed to fetch resource', 'details': str(e)}), 500

@resource_bp.route('/resources/financial-overview', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_financial_overview():
    from src.infrastructure.db import SessionLocal
    session = SessionLocal()
    resources = session.query(Resource).all()
    # Monthly financials
    monthlyFinancials = []
    month_map = {}
    for r in resources:
        if r.joining_date and r.monthly_cost:
            month = r.joining_date.strftime('%b %Y')
            if month not in month_map:
                month_map[month] = {'total': 0, 'billable': 0, 'nonBillable': 0, 'intern': 0}
            month_map[month]['total'] += r.monthly_cost or 0
            if getattr(r, 'billable_status', False):
                month_map[month]['billable'] += r.monthly_cost or 0
            elif getattr(r, 'is_intern', False):
                month_map[month]['intern'] += r.monthly_cost or 0
            else:
                month_map[month]['nonBillable'] += r.monthly_cost or 0
    for month, data in sorted(month_map.items()):
        monthlyFinancials.append({
            'month': month,
            'total': data['total'],
            'billable': data['billable'],
            'nonBillable': data['nonBillable'],
            'intern': data['intern']
        })
    # YTD totals
    ytdTotals = {'total': 0, 'billable': 0, 'nonBillable': 0, 'intern': 0}
    for r in resources:
        ytdTotals['total'] += r.monthly_cost or 0
        if getattr(r, 'billable_status', False):
            ytdTotals['billable'] += r.monthly_cost or 0
        elif getattr(r, 'is_intern', False):
            ytdTotals['intern'] += r.monthly_cost or 0
        else:
            ytdTotals['nonBillable'] += r.monthly_cost or 0
    return jsonify({
        'monthlyFinancials': monthlyFinancials,
        'ytdTotals': ytdTotals
    })


