"""add result summary_data column

Revision ID: 002
Revises: 001
Create Date: 2025-01-29

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade():
    # Add summary_data column to results table
    op.add_column('results', sa.Column('summary_data', sa.JSON(), nullable=True))


def downgrade():
    # Remove summary_data column
    op.drop_column('results', 'summary_data')
