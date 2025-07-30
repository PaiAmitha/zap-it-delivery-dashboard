from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
import logging
from datetime import datetime, timedelta
from src.infrastructure.db import SessionLocal
from src.domain.models import Resource

resource_bp = Blueprint('resources', __name__)

# --- Financial Dashboard Endpoint ---
@resource_bp.route('/financial-overview', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_financial_dashboard():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    resources = db.query(Resource).all()
    # Example aggregation logic
    monthlyFinancials = []
    ytdTotals = {'total': 0, 'billable': 0, 'nonBillable': 0, 'intern': 0}
    for r in resources:
        cost = getattr(r, 'monthly_cost', 0)
        ytdTotals['total'] += cost
        if getattr(r, 'billableStatus', False):
            ytdTotals['billable'] += cost
        elif getattr(r, 'is_intern', False):
            ytdTotals['intern'] += cost
        else:
            ytdTotals['nonBillable'] += cost
    # Example: monthly breakdown (could be improved with real data)
    monthlyFinancials.append({
        'month': 'Jul 2025',
        'total': ytdTotals['total'],
        'billable': ytdTotals['billable'],
        'nonBillable': ytdTotals['nonBillable'],
        'intern': ytdTotals['intern']
    })
    db.close()
    return jsonify({'financialDashboard': {
        'monthlyFinancials': monthlyFinancials,
        'ytdTotals': ytdTotals
    }})
# --- Resource Analytics Endpoints ---
@resource_bp.route('/resources/analytics/seniority', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_seniority_analytics():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    resources = db.query(Resource).all()
    seniority_buckets = {
        'Senior (6+ yrs)': {'count': 0, 'monthlyCost': 0},
        'Mid-Senior (3-6 yrs)': {'count': 0, 'monthlyCost': 0},
        'Junior (1-3 yrs)': {'count': 0, 'monthlyCost': 0}
    }
    for r in resources:
        years = getattr(r, 'years_experience', 0)
        cost = getattr(r, 'monthly_cost', 0)
        if years >= 6:
            bucket = 'Senior (6+ yrs)'
        elif years >= 3:
            bucket = 'Mid-Senior (3-6 yrs)'
        else:
            bucket = 'Junior (1-3 yrs)'
        seniority_buckets[bucket]['count'] += 1
        seniority_buckets[bucket]['monthlyCost'] += cost
    data = []
    total = sum(b['count'] for b in seniority_buckets.values())
    for k, v in seniority_buckets.items():
        data.append({
            'level': k,
            'count': v['count'],
            'percentage': round((v['count']/total)*100, 1) if total else 0,
            'monthlyCost': v['monthlyCost'],
            'ytdCost': v['monthlyCost']*6
        })
    db.close()
    return jsonify({'seniorityData': data})

@resource_bp.route('/resources/analytics/skills', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_skill_analytics():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    resources = db.query(Resource).all()
    skill_buckets = {}
    for r in resources:
        skills = (r.skills or '').split(',')
        cost = getattr(r, 'monthly_cost', 0)
        for skill in skills:
            skill = skill.strip()
            if not skill:
                continue
            if skill not in skill_buckets:
                skill_buckets[skill] = {'count': 0, 'monthlyCost': 0}
            skill_buckets[skill]['count'] += 1
            skill_buckets[skill]['monthlyCost'] += cost
    data = [{'category': k, 'count': v['count'], 'monthlyCost': v['monthlyCost']} for k, v in skill_buckets.items()]
    db.close()
    return jsonify({'skillData': data})

@resource_bp.route('/resources/analytics/aging', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_aging_analytics():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    resources = db.query(Resource).all()
    aging_buckets = {
        '<30 days': {'count': 0, 'monthlyCost': 0, 'avgDailyCost': 0, 'riskLevel': 'low'},
        '30-60 days': {'count': 0, 'monthlyCost': 0, 'avgDailyCost': 0, 'riskLevel': 'medium'},
        '60-90 days': {'count': 0, 'monthlyCost': 0, 'avgDailyCost': 0, 'riskLevel': 'high'},
        '>90 days': {'count': 0, 'monthlyCost': 0, 'avgDailyCost': 0, 'riskLevel': 'high'}
    }
    today = datetime.today().date()
    for r in resources:
        bench_days = getattr(r, 'bench_days', 0)
        cost = getattr(r, 'monthly_cost', 0)
        if bench_days < 30:
            bucket = '<30 days'
        elif bench_days < 60:
            bucket = '30-60 days'
        elif bench_days < 90:
            bucket = '60-90 days'
        else:
            bucket = '>90 days'
        aging_buckets[bucket]['count'] += 1
        aging_buckets[bucket]['monthlyCost'] += cost
        aging_buckets[bucket]['avgDailyCost'] += cost/30 if cost else 0
    data = []
    for k, v in aging_buckets.items():
        data.append({
            'bucket': k,
            'count': v['count'],
            'monthlyCost': v['monthlyCost'],
            'avgDailyCost': round(v['avgDailyCost'], 2),
            'riskLevel': v['riskLevel']
        })
    db.close()
    return jsonify({'agingData': data})

@resource_bp.route('/resources/analytics/engagement', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_engagement_analytics():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    resources = db.query(Resource).all()
    engagement_buckets = {}
    for r in resources:
        engagement_type = getattr(r, 'engagement_type', None) or 'Unknown'
        cost = getattr(r, 'monthly_cost', 0)
        start_date = getattr(r, 'engagement_start_date', None)
        end_date = getattr(r, 'engagement_end_date', None)
        notes = getattr(r, 'engagement_notes', '')
        if engagement_type not in engagement_buckets:
            engagement_buckets[engagement_type] = {'count': 0, 'monthlyCost': 0, 'startDate': start_date, 'endDate': end_date, 'notes': notes}
        engagement_buckets[engagement_type]['count'] += 1
        engagement_buckets[engagement_type]['monthlyCost'] += cost
    data = []
    for k, v in engagement_buckets.items():
        data.append({
            'type': k,
            'count': v['count'],
            'monthlyCost': v['monthlyCost'],
            'startDate': v['startDate'].strftime('%Y-%m-%d') if v['startDate'] else None,
            'endDate': v['endDate'].strftime('%Y-%m-%d') if v['endDate'] else None,
            'notes': v['notes']
        })
    db.close()
    return jsonify({'engagementData': data})

from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
import logging
from datetime import datetime, timedelta
from src.infrastructure.db import SessionLocal
from src.domain.models import Resource

resource_bp = Blueprint('resources', __name__)

# --- Upcoming Releases Endpoint ---
@resource_bp.route('/upcoming-releases', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_upcoming_releases():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    today = datetime.today().date()
    two_months_later = today + timedelta(days=62)
    resources = db.query(Resource).all()
    upcoming = []
    for r in resources:
        end_dates = []
        if r.engagement_end_date:
            end_dates.append(r.engagement_end_date)
        if hasattr(r, 'training_end_date') and r.training_end_date:
            end_dates.append(r.training_end_date)
        if r.internship_end_date:
            end_dates.append(r.internship_end_date)
        soonest = None
        for d in end_dates:
            if d and today <= d <= two_months_later:
                if not soonest or d < soonest:
                    soonest = d
        if soonest:
            upcoming.append({
                'employeeId': r.employee_id or r.id,
                'fullName': r.full_name,
                'releaseDate': soonest.strftime('%Y-%m-%d'),
                'utilization': getattr(r, 'utilization_rate', None) or getattr(r, 'utilization', None) or 0,
                'currentProject': r.project_name or r.current_engagement or '',
                'skills': r.skills.split(',') if r.skills else [],
                'status': getattr(r, 'status', 'confirmed'),
                'resourceId': r.id,
            })
    db.close()
    return jsonify({'upcomingReleases': upcoming})

# --- Interns Endpoint ---
@resource_bp.route('/interns', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_interns():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    interns = db.query(Resource).filter(Resource.is_intern == True).all()
    data = [r.to_dict() for r in interns]
    db.close()
    return jsonify({'interns': data})

# --- Resignations Endpoint ---

@resource_bp.route('/resignations', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_resignations():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    today = datetime.today().date()
    two_months_ago = today - timedelta(days=62)
    resigned = db.query(Resource).filter(
        Resource.status.in_(['resigned', 'Resigned', 'RESIGNED']),
        Resource.reason != None,
        Resource.reason != '',
        Resource.last_project_end_date != None,
        Resource.last_project_end_date >= two_months_ago,
        Resource.last_project_end_date <= today
    ).all()
    data = [r.to_dict() for r in resigned]
    db.close()
    return jsonify({'resignations': data})
# --- Locations Endpoint ---
@resource_bp.route('/locations', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_locations():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    locations = db.query(Resource.location).distinct().all()
    location_list = [loc[0] for loc in locations if loc[0]]
    db.close()
    return jsonify({'locations': location_list})

# --- Resource CRUD Endpoints ---
@resource_bp.route('/resources', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_resources():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    resources = db.query(Resource).all()
    data = [r.to_dict() for r in resources]
    db.close()
    return jsonify({'resources': data})

@resource_bp.route('/resources', methods=['POST', 'OPTIONS'])
@cross_origin()
def create_resource():
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    data = request.get_json()
    resource = Resource(**data)
    db.add(resource)
    db.commit()
    db.refresh(resource)
    result = resource.to_dict()
    db.close()
    return jsonify(result), 201

@resource_bp.route('/resources/<int:resource_id>', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_resource_by_id(resource_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        db.close()
        return jsonify({'error': 'Resource not found'}), 404
    data = resource.to_dict()
    db.close()
    return jsonify(data)

@resource_bp.route('/resources/<int:resource_id>', methods=['PUT', 'OPTIONS'])
@cross_origin()
def update_resource(resource_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    data = request.get_json()
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        db.close()
        return jsonify({'error': 'Resource not found'}), 404
    for key, value in data.items():
        setattr(resource, key, value)
    db.commit()
    db.refresh(resource)
    result = resource.to_dict()
    db.close()
    return jsonify(result)

@resource_bp.route('/resources/<int:resource_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin()
def delete_resource(resource_id):
    if request.method == 'OPTIONS':
        return '', 204
    db = SessionLocal()
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        db.close()
        return jsonify({'error': 'Resource not found'}), 404
    db.delete(resource)
    db.commit()
    db.close()
    return jsonify({'deleted': True})
