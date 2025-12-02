-- Простой скрипт для добавления тестовых событий
-- Запуск: psql -U eventhub -d eventhub -f scripts/add_test_events_simple.sql
-- Или через docker: docker exec -i eventhub-db psql -U eventhub -d eventhub < scripts/add_test_events_simple.sql

-- Создаем системного пользователя, если его нет
INSERT INTO users (email, hashed_password, full_name, role, created_at, updated_at)
SELECT 
    'system@eventhub.kz',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q5',
    'System',
    'admin',
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'system@eventhub.kz');

-- Добавляем события (проверяем дубликаты по title и date_start)
WITH system_user AS (
    SELECT id FROM users WHERE email = 'system@eventhub.kz' LIMIT 1
)
INSERT INTO events (title, description, type, date_start, date_end, city, is_online, requirements, source, source_url, banner, organizer_id, created_at, updated_at)
SELECT * FROM (VALUES
    ('HackNU 2025', 'Крупнейший хакатон в Казахстане от Nazarbayev University. Соревнование по разработке инновационных решений в области AI, HealthTech и FinTech.', 'hackathon', NOW() + INTERVAL '30 days', NOW() + INTERVAL '32 days', 'Астана', false, 'Студенты и выпускники университетов Казахстана. Команды 2-5 человек.', 'external', 'https://nu.edu.kz/hackathon', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Nazarbayev_University_logo.svg/200px-Nazarbayev_University_logo.svg.png'),
    ('NU Tech Summit 2025', 'Ежегодная конференция о технологиях и инновациях. Доклады от ведущих экспертов, воркшопы и нетворкинг.', 'seminar', NOW() + INTERVAL '45 days', NOW() + INTERVAL '45 days', 'Астана', false, 'Открыто для всех', 'external', 'https://nu.edu.kz/tech-summit', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Nazarbayev_University_logo.svg/200px-Nazarbayev_University_logo.svg.png'),
    ('NU AI Challenge', 'Соревнование по машинному обучению и искусственному интеллекту. Решайте реальные задачи от индустриальных партнеров.', 'tournament', NOW() + INTERVAL '20 days', NOW() + INTERVAL '60 days', 'Астана', true, 'Знание Python, базовые навыки ML', 'external', 'https://nu.edu.kz/ai-challenge', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Nazarbayev_University_logo.svg/200px-Nazarbayev_University_logo.svg.png'),
    ('Astana Hub Hackathon 2025', 'Международный хакатон от Astana Hub. Разработайте решение для цифровизации государственных услуг. Призовой фонд 5,000,000 ₸.', 'hackathon', NOW() + INTERVAL '25 days', NOW() + INTERVAL '27 days', 'Астана', false, 'Команды 3-6 человек. Опыт разработки приветствуется.', 'external', 'https://astanahub.com/hackathon', 'https://astanahub.com/static/images/logo.svg'),
    ('Startup Weekend Astana', '54 часа на создание стартапа. От идеи до MVP за выходные. Менторы, инвесторы, призы.', 'hackathon', NOW() + INTERVAL '15 days', NOW() + INTERVAL '17 days', 'Астана', false, 'Любой желающий. Команды формируются на месте.', 'external', 'https://astanahub.com/startup-weekend', 'https://astanahub.com/static/images/logo.svg'),
    ('TechTalks Astana Hub', 'Еженедельные встречи разработчиков. Доклады о новых технологиях, обмен опытом, нетворкинг.', 'seminar', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days', 'Астана', false, 'Регистрация обязательна', 'external', 'https://astanahub.com/techtalks', 'https://astanahub.com/static/images/logo.svg'),
    ('Blockchain Workshop', 'Практический воркшоп по разработке на блокчейне. Создайте свой первый смарт-контракт.', 'seminar', NOW() + INTERVAL '12 days', NOW() + INTERVAL '12 days', 'Астана', false, 'Базовые знания программирования', 'external', 'https://astanahub.com/blockchain-workshop', 'https://astanahub.com/static/images/logo.svg')
) AS v(title, description, type, date_start, date_end, city, is_online, requirements, source, source_url, banner)
CROSS JOIN system_user
WHERE NOT EXISTS (
    SELECT 1 FROM events e 
    WHERE e.title = v.title 
    AND ABS(EXTRACT(EPOCH FROM (e.date_start - v.date_start))) < 86400  -- в пределах дня
)
RETURNING title;

