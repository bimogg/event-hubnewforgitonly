from alembic import op
import sqlalchemy as sa


revision = "0002_add_event_source_fields"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Делаем organizer_id nullable для поддержки внешних событий
    op.alter_column("events", "organizer_id", nullable=True, existing_type=sa.Integer())

    # Добавляем поля source и source_url
    op.add_column("events", sa.Column("source", sa.String(length=50), nullable=True))
    op.add_column("events", sa.Column("source_url", sa.String(length=512), nullable=True))

    # Создаем индекс для быстрого поиска внешних событий
    op.create_index("ix_events_source", "events", ["source"])


def downgrade() -> None:
    # Удаляем индекс
    op.drop_index("ix_events_source", table_name="events")

    # Удаляем колонки
    op.drop_column("events", "source_url")
    op.drop_column("events", "source")

    # Возвращаем organizer_id как NOT NULL (но это может вызвать проблемы, если есть внешние события)
    # В реальном проекте нужно сначала удалить все события с NULL organizer_id
    op.alter_column("events", "organizer_id", nullable=False, existing_type=sa.Integer())

