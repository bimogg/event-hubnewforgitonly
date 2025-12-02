from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=50), nullable=False, server_default="user"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
    )
    op.create_index("ix_users_id", "users", ["id"])
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "interests",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
    )
    op.create_index("ix_interests_id", "interests", ["id"])
    op.create_index("ix_interests_name", "interests", ["name"], unique=True)

    op.create_table(
        "skills",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
    )
    op.create_index("ix_skills_id", "skills", ["id"])
    op.create_index("ix_skills_name", "skills", ["name"], unique=True)

    op.create_table(
        "profiles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False, unique=True),
        sa.Column("name", sa.String(length=255), nullable=True),
        sa.Column("username", sa.String(length=255), nullable=True),
        sa.Column("avatar", sa.String(length=512), nullable=True),
        sa.Column("bio", sa.Text(), nullable=True),
        sa.Column("city", sa.String(length=255), nullable=True),
        sa.Column("experience_level", sa.String(length=50), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_profiles_id", "profiles", ["id"])
    op.create_index("ix_profiles_username", "profiles", ["username"], unique=True)

    op.create_table(
        "profile_interests",
        sa.Column("profile_id", sa.Integer(), primary_key=True),
        sa.Column("interest_id", sa.Integer(), primary_key=True),
        sa.ForeignKeyConstraint(["profile_id"], ["profiles.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["interest_id"], ["interests.id"], ondelete="CASCADE"),
    )

    op.create_table(
        "profile_skills",
        sa.Column("profile_id", sa.Integer(), primary_key=True),
        sa.Column("skill_id", sa.Integer(), primary_key=True),
        sa.Column("level", sa.Integer(), nullable=False, server_default="1"),
        sa.ForeignKeyConstraint(["profile_id"], ["profiles.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["skill_id"], ["skills.id"], ondelete="CASCADE"),
    )

    op.create_table(
        "teams",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.Column("skills_matrix", postgresql.JSONB(), nullable=True),
        sa.Column("achievements", postgresql.JSONB(), nullable=True),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_teams_id", "teams", ["id"])
    op.create_index("ix_teams_name", "teams", ["name"], unique=True)

    op.create_table(
        "team_members",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("team_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("role_name", sa.String(length=255), nullable=True),
        sa.ForeignKeyConstraint(["team_id"], ["teams.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_team_members_id", "team_members", ["id"])

    op.create_table(
        "team_roles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("team_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(["team_id"], ["teams.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_team_roles_id", "team_roles", ["id"])

    op.create_table(
        "team_open_positions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("team_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("required_skills", postgresql.JSONB(), nullable=True),
        sa.Column("is_open", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.ForeignKeyConstraint(["team_id"], ["teams.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_team_open_positions_id", "team_open_positions", ["id"])

    op.create_table(
        "events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("date_start", sa.DateTime(timezone=True), nullable=False),
        sa.Column("date_end", sa.DateTime(timezone=True), nullable=True),
        sa.Column("city", sa.String(length=255), nullable=True),
        sa.Column("is_online", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("type", sa.String(length=50), nullable=False, server_default="other"),
        sa.Column("organizer_id", sa.Integer(), nullable=False),
        sa.Column("banner", sa.String(length=512), nullable=True),
        sa.Column("requirements", sa.Text(), nullable=True),
        sa.Column("tags", postgresql.ARRAY(sa.String()), nullable=True),
        sa.ForeignKeyConstraint(["organizer_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_events_id", "events", ["id"])

    op.create_table(
        "event_registrations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("event_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="registered"),
        sa.ForeignKeyConstraint(["event_id"], ["events.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_event_registrations_id", "event_registrations", ["id"])

    op.create_table(
        "chats",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("type", sa.String(length=50), nullable=False),
        sa.Column("team_id", sa.Integer(), nullable=True),
        sa.Column("event_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["team_id"], ["teams.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["event_id"], ["events.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_chats_id", "chats", ["id"])

    op.create_table(
        "chat_participants",
        sa.Column("chat_id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), primary_key=True),
        sa.ForeignKeyConstraint(["chat_id"], ["chats.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )

    op.create_table(
        "messages",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("chat_id", sa.Integer(), nullable=False),
        sa.Column("sender_id", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["chat_id"], ["chats.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["sender_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_messages_id", "messages", ["id"])


def downgrade() -> None:
    op.drop_table("messages")
    op.drop_table("chat_participants")
    op.drop_table("chats")
    op.drop_table("event_registrations")
    op.drop_table("events")
    op.drop_table("team_open_positions")
    op.drop_table("team_roles")
    op.drop_table("team_members")
    op.drop_table("teams")
    op.drop_table("profile_skills")
    op.drop_table("profile_interests")
    op.drop_table("profiles")
    op.drop_table("skills")
    op.drop_table("interests")
    op.drop_table("users")

