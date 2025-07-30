# This script updates all NULL titles in the escalations table to 'Untitled'.

from sqlalchemy import create_engine, text
import os
import configparser

# Try environment variable first
DATABASE_URL = os.environ.get('DATABASE_URL')

if not DATABASE_URL:
    # Fallback: read from alembic.ini
    config = configparser.ConfigParser()
    config.read(os.path.join(os.path.dirname(__file__), '../config/alembic.ini'))
    DATABASE_URL = config.get('alembic', 'sqlalchemy.url')

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    result = conn.execute(text("""
        UPDATE escalations SET title = 'Untitled' WHERE title IS NULL;
    """))
    conn.commit()
    print(f"Rows updated: {result.rowcount}")
