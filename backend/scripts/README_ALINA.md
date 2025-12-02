# Добавление тестового пользователя "алина"

## Данные для входа:
- **Email**: `alina@example.com`
- **Пароль**: `password123`

## Способ 1: Через Docker (рекомендуется)

```bash
docker exec -i eventhub-clean-db-1 psql -U eventhub -d eventhub < backend/scripts/add_test_user_alina.sql
```

## Способ 2: Локально (если БД запущена локально)

```bash
psql -U eventhub -d eventhub -f backend/scripts/add_test_user_alina.sql
```

## Способ 3: Через Python скрипт

```bash
cd backend
python3 scripts/add_user_alina.py
```

## Проверка

После выполнения скрипта можно проверить, что пользователь создан:

```sql
SELECT id, email, role, is_active, created_at FROM users WHERE email = 'alina@example.com';
```

