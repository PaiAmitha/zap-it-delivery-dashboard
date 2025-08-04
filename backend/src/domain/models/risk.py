from src.presentation.extensions import db

class Risk(db.Model):
    __tablename__ = 'risks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    owner = db.Column(db.String)
    status = db.Column(db.String)
    impact = db.Column(db.String)
    likelihood = db.Column(db.String)
    mitigation_plan = db.Column(db.String)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    issue = db.Column(db.String)
    priority = db.Column(db.String)
    risk_type = db.Column(db.String)
    risk_level = db.Column(db.String)
    risk_date = db.Column(db.Date)
    probability = db.Column(db.String)
    notes = db.Column(db.String)
    # Add more fields as needed for analytics/reporting

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
