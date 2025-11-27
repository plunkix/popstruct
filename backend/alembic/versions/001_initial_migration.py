"""initial migration

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('is_admin', sa.Boolean(), default=False),
        sa.Column('subscription_tier', sa.Enum('free', 'premium', name='subscriptiontier'), nullable=False),
        sa.Column('stripe_customer_id', sa.String(), nullable=True),
        sa.Column('stripe_subscription_id', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Create datasets table
    op.create_table(
        'datasets',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('file_type', sa.Enum('vcf', 'csv', 'txt', name='filetype'), nullable=False),
        sa.Column('file_path', sa.String(), nullable=False),
        sa.Column('file_size_mb', sa.Float(), nullable=False),
        sa.Column('n_samples', sa.Integer(), nullable=True),
        sa.Column('n_variants', sa.Integer(), nullable=True),
        sa.Column('owner_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_datasets_id'), 'datasets', ['id'], unique=False)

    # Create jobs table
    op.create_table(
        'jobs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('analysis_type', sa.Enum('pca', 'clustering', 'kinship', 'full_analysis', name='analysistype'), nullable=False),
        sa.Column('status', sa.Enum('pending', 'running', 'completed', 'failed', name='jobstatus'), nullable=False),
        sa.Column('parameters', sa.JSON(), nullable=True),
        sa.Column('progress_percent', sa.Integer(), default=0),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('celery_task_id', sa.String(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('dataset_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['dataset_id'], ['datasets.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_jobs_id'), 'jobs', ['id'], unique=False)

    # Create results table
    op.create_table(
        'results',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('job_id', sa.Integer(), nullable=False),
        sa.Column('result_file_path', sa.String(), nullable=True),
        sa.Column('result_size_mb', sa.Float(), nullable=True),
        sa.Column('pca_variance_explained', sa.JSON(), nullable=True),
        sa.Column('pca_components_path', sa.String(), nullable=True),
        sa.Column('n_clusters', sa.Integer(), nullable=True),
        sa.Column('cluster_labels_path', sa.String(), nullable=True),
        sa.Column('silhouette_score', sa.Float(), nullable=True),
        sa.Column('kinship_matrix_path', sa.String(), nullable=True),
        sa.Column('pca_plot_path', sa.String(), nullable=True),
        sa.Column('cluster_plot_path', sa.String(), nullable=True),
        sa.Column('kinship_heatmap_path', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['job_id'], ['jobs.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_results_id'), 'results', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_results_id'), table_name='results')
    op.drop_table('results')
    op.drop_index(op.f('ix_jobs_id'), table_name='jobs')
    op.drop_table('jobs')
    op.drop_index(op.f('ix_datasets_id'), table_name='datasets')
    op.drop_table('datasets')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')

    op.execute('DROP TYPE IF EXISTS subscriptiontier')
    op.execute('DROP TYPE IF EXISTS filetype')
    op.execute('DROP TYPE IF EXISTS analysistype')
    op.execute('DROP TYPE IF EXISTS jobstatus')
