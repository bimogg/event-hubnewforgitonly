from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "0003_add_internship_slots"
down_revision = "0002_add_event_source_fields"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Таблица слотов стажировок
    op.create_table(
        "internship_slots",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("company_id", sa.Integer(), nullable=False),
        sa.Column("operation", sa.String(length=255), nullable=False),
        sa.Column("required_skills", postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column("required_skills_level", postgresql.JSONB(), nullable=True),
        sa.Column("slot_start", sa.DateTime(timezone=True), nullable=False),
        sa.Column("slot_end", sa.DateTime(timezone=True), nullable=False),
        sa.Column("duration_hours", sa.Float(), nullable=False),
        sa.Column("address", sa.String(length=512), nullable=False),
        sa.Column("city", sa.String(length=255), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("payment", sa.Float(), nullable=True),
        sa.Column("bonus", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="draft"),
        sa.Column("max_applicants", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("current_applicants", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("checklist", postgresql.ARRAY(sa.Text()), nullable=True),
        sa.Column("quality_metrics", postgresql.JSONB(), nullable=True),
        sa.ForeignKeyConstraint(["company_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_internship_slots_id", "internship_slots", ["id"])
    op.create_index("ix_internship_slots_company_id", "internship_slots", ["company_id"])

    # Таблица заявок на слоты
    op.create_table(
        "slot_applications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("slot_id", sa.Integer(), nullable=False),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="pending"),
        sa.Column("motivation", sa.Text(), nullable=True),
        sa.Column("applied_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["slot_id"], ["internship_slots.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["student_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_slot_applications_id", "slot_applications", ["id"])
    op.create_index("ix_slot_applications_slot_id", "slot_applications", ["slot_id"])
    op.create_index("ix_slot_applications_student_id", "slot_applications", ["student_id"])

    # Таблица завершений слотов
    op.create_table(
        "slot_completions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("application_id", sa.Integer(), nullable=False, unique=True),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="pending"),
        sa.Column("checklist_completed", postgresql.ARRAY(sa.Boolean()), nullable=True),
        sa.Column("photos", postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column("master_id", sa.Integer(), nullable=True),
        sa.Column("master_feedback", sa.Text(), nullable=True),
        sa.Column("master_rating", sa.Integer(), nullable=True),
        sa.Column("is_ready", sa.Boolean(), nullable=True),
        sa.Column("completion_time_minutes", sa.Integer(), nullable=True),
        sa.Column("quality_score", sa.Float(), nullable=True),
        sa.Column("confirmed_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["application_id"], ["slot_applications.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["master_id"], ["users.id"], ondelete="SET NULL"),
    )
    op.create_index("ix_slot_completions_id", "slot_completions", ["id"])
    op.create_index("ix_slot_completions_application_id", "slot_completions", ["application_id"], unique=True)


def downgrade() -> None:
    op.drop_table("slot_completions")
    op.drop_table("slot_applications")
    op.drop_table("internship_slots")

