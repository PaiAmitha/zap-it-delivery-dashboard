try:
    from backend.src.infrastructure.db import SessionLocal
    from backend.src.domain.models.sprint import Sprint
except ModuleNotFoundError:
    import sys, os
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))
    from infrastructure.db import SessionLocal
    from domain.models.sprint import Sprint

def clean_bad_sprints():
    db = SessionLocal()
    bad_sprints = db.query(Sprint).filter((Sprint.start_date == None) | (Sprint.end_date == None)).all()
    for sprint in bad_sprints:
        print(f"Deleting Sprint ID {sprint.id} (project {sprint.project_id}) - missing start/end date")
        db.delete(sprint)
    db.commit()
    db.close()
    print(f"Deleted {len(bad_sprints)} bad sprints.")

if __name__ == "__main__":
    clean_bad_sprints()
