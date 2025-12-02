# Быстрый вход как "алина"

## Данные для входа в приложение:
- **Email**: `alina@example.com`
- **Пароль**: `password123`

## Добавить пользователя в БД:

### Способ 1: Через Docker (если БД в Docker)
```bash
docker exec -i eventhub-clean-db-1 psql -U eventhub -d eventhub < backend/scripts/add_test_user_alina.sql
```

Или если контейнер называется по-другому:
```bash
docker ps  # найти имя контейнера с БД
docker exec -i <ИМЯ_КОНТЕЙНЕРА> psql -U eventhub -d eventhub < backend/scripts/add_test_user_alina.sql
```

### Способ 2: Локально (если БД запущена локально)
```bash
psql -U eventhub -d eventhub -f backend/scripts/add_test_user_alina.sql
```

### Способ 3: Через Python скрипт
```bash
cd backend
python3 scripts/add_user_alina.py
```

## Проверка:
После выполнения скрипта можно проверить:
```sql
SELECT id, email, role, is_active FROM users WHERE email = 'alina@example.com';
```

## Вход в приложение:
1. Откройте http://localhost:5175
2. Нажмите "Войти" или "Регистрироваться"
3. Введите:
   - Email: `alina@example.com`
   - Пароль: `password123`

