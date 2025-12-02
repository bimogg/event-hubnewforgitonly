# Добавление тестовых событий

Этот скрипт добавляет тестовые события из NU и Astana Hub в базу данных.

## События

### Из Nazarbayev University (NU):
- **HackNU 2025** - Крупнейший хакатон в Казахстане
- **NU Tech Summit 2025** - Конференция о технологиях
- **NU AI Challenge** - Соревнование по машинному обучению

### Из Astana Hub:
- **Astana Hub Hackathon 2025** - Международный хакатон
- **Startup Weekend Astana** - 54 часа на создание стартапа
- **TechTalks Astana Hub** - Еженедельные встречи разработчиков
- **Blockchain Workshop** - Воркшоп по блокчейну

## Способы добавления

### Вариант 1: Через SQL скрипт (рекомендуется)

Если у вас есть доступ к PostgreSQL:

```bash
# Локально
psql -U eventhub -d eventhub -f backend/scripts/add_test_events_simple.sql

# Через Docker
docker exec -i eventhub-db psql -U eventhub -d eventhub < backend/scripts/add_test_events_simple.sql
```

### Вариант 2: Через Python скрипт

```bash
cd backend
python3 scripts/add_test_events.py
```

**Примечание:** Убедитесь, что виртуальное окружение активировано и все зависимости установлены.

### Вариант 3: Через API (если бэкенд запущен)

1. Запустите бэкенд
2. Авторизуйтесь как администратор
3. Вызовите endpoint:
```bash
curl -X POST http://localhost:8000/admin/run-scraper \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Проверка

После добавления событий проверьте, что они появились:

```bash
# Через SQL
psql -U eventhub -d eventhub -c "SELECT title, date_start, source FROM events WHERE source = 'external';"

# Через API
curl http://localhost:8000/events/
```

События должны появиться на странице `/events` во фронтенде.

