from ...presentation.extensions import db

class Escalation(db.Model):
    __tablename__ = 'escalations'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    customer = db.Column(db.String)
    project = db.Column(db.String)
    owner = db.Column(db.String)
    priority = db.Column(db.String)
    status = db.Column(db.String)
    date_raised = db.Column(db.String)
    resolution_eta = db.Column(db.String)
    description = db.Column(db.String)
    risk_level = db.Column(db.String)
    issue = db.Column(db.String)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    escalation_type = db.Column(db.String)
    escalation_date = db.Column(db.Date)
    resolution_date = db.Column(db.Date)
    resolution_status = db.Column(db.String)
    escalation_notes = db.Column(db.String)
    impact = db.Column(db.String)
    severity = db.Column(db.String)
    actions_taken = db.Column(db.String)
    follow_up = db.Column(db.String)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
