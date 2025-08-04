from flask import Blueprint, jsonify
from src.infrastructure.db import SessionLocal
from src.domain.models.resource import Resource
from src.domain.models.intern import Intern

resource_kpi_bp = Blueprint('resource_kpi', __name__)

@resource_kpi_bp.route('/api/resources/kpi-counts', methods=['GET'])
def get_resource_kpi_counts():
    session = SessionLocal()
    resources = session.query(Resource).all()
    interns = session.query(Intern).all()
    total = len(resources)
    billable = len([r for r in resources if getattr(r, 'billable_status', False)])
    non_billable = len([r for r in resources if not getattr(r, 'billable_status', False)])
    intern = len([r for r in resources if getattr(r, 'is_intern', False)])
    return jsonify({
        'resourceCounts': {
            'total': total,
            'billable': billable,
            'nonBillable': non_billable,
            'intern': intern
        }
    })
