from alembic import op
import sqlalchemy as sa


revision = "0004_add_resume_path_to_users"
down_revision = "0003_add_internship_slots"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("resume_path", sa.String(length=500), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "resume_path")

