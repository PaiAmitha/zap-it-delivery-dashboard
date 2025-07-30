"""Add Sprint model and relationship to Project

Revision ID: 7d9d438c0125
Revises: 665207ec972f
Create Date: 2025-07-25 16:25:01.025450

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7d9d438c0125'
down_revision = '665207ec972f'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'sprints',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('project_id', sa.Integer(), sa.ForeignKey('projects.id'), nullable=False),
        sa.Column('sprint_number', sa.Integer(), nullable=False),
        sa.Column('name', sa.String()),
        sa.Column('start_date', sa.Date()),
        sa.Column('end_date', sa.Date()),
        sa.Column('velocity', sa.Float()),
        sa.Column('predictability', sa.Float()),
        sa.Column('defect_leakage', sa.Float()),
        sa.Column('on_time_delivery', sa.Float()),
        sa.Column('planned_story_points', sa.Integer()),
        sa.Column('completed_story_points', sa.Integer()),
        sa.Column('test_cases_executed', sa.Integer()),
        sa.Column('test_cases_passed', sa.Integer()),
        sa.Column('created_at', sa.Date()),
        sa.Column('updated_at', sa.Date()),
    )


def downgrade():
    op.drop_table('sprints')
