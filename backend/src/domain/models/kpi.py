from ...presentation.extensions import db

class KPI(db.Model):
    __tablename__ = 'kpis'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    value = db.Column(db.Float)
    target = db.Column(db.Float)
    status = db.Column(db.String)
    description = db.Column(db.String)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    title = db.Column(db.String)
    subtitle = db.Column(db.String)
    trend = db.Column(db.String)
    icon = db.Column(db.String)
    entity_type = db.Column(db.String)
    kpi_type = db.Column(db.String)
    kpi_category = db.Column(db.String)
    kpi_date = db.Column(db.Date)
    kpi_notes = db.Column(db.String)
    kpi_target = db.Column(db.Float)
    kpi_actual = db.Column(db.Float)
    kpi_status = db.Column(db.String)
    # Add more fields as needed for analytics/reporting
