"""add job tracking and razorpay fields

Revision ID: 004
Revises: 002
Create Date: 2025-12-01

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '004'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add jobs_used column for tracking free tier usage
    op.add_column('users', sa.Column('jobs_used', sa.Integer(), nullable=False, server_default='0'))

    # Remove Stripe columns, add Razorpay columns
    op.add_column('users', sa.Column('razorpay_customer_id', sa.String(), nullable=True))
    op.add_column('users', sa.Column('razorpay_order_id', sa.String(), nullable=True))
    op.add_column('users', sa.Column('razorpay_payment_id', sa.String(), nullable=True))

    # Drop old Stripe columns if they exist
    try:
        op.drop_column('users', 'stripe_customer_id')
        op.drop_column('users', 'stripe_subscription_id')
    except:
        pass  # Columns might not exist


def downgrade() -> None:
    # Remove new columns
    op.drop_column('users', 'razorpay_payment_id')
    op.drop_column('users', 'razorpay_order_id')
    op.drop_column('users', 'razorpay_customer_id')
    op.drop_column('users', 'jobs_used')

    # Re-add Stripe columns
    op.add_column('users', sa.Column('stripe_customer_id', sa.String(), nullable=True))
    op.add_column('users', sa.Column('stripe_subscription_id', sa.String(), nullable=True))
