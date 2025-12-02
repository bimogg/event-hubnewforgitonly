-- Скрипт для добавления событий за последний месяц от NU и Astana Hub
-- Запуск: psql -U eventhub -d eventhub -f scripts/add_past_month_events.sql
-- Или через docker: docker exec -i eventhub-db psql -U eventhub -d eventhub < scripts/add_past_month_events.sql

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

-- Добавляем события за последний месяц (от 1 до 30 дней назад)
WITH system_user AS (
    SELECT id FROM users WHERE email = 'system@eventhub.kz' LIMIT 1
)
INSERT INTO events (title, description, type, date_start, date_end, city, is_online, requirements, source, source_url, banner, organizer_id, created_at, updated_at)
SELECT * FROM (VALUES
    -- События от Nazarbayev University (за последний месяц)
    ('NU Winter Hackathon 2024', 'Зимний хакатон от Nazarbayev University. Разработка решений для образования и здравоохранения. Призовой фонд 3,000,000 ₸.', 'hackathon', NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days', 'Астана', false, 'Студенты и выпускники. Команды 2-5 человек.', 'external', 'https://nu.edu.kz/events/winter-hackathon', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Nazarbayev_University_logo.svg/200px-Nazarbayev_University_logo.svg.png'),
    ('NU Data Science Workshop', 'Практический воркшоп по Data Science и машинному обучению. Работа с реальными датасетами.', 'seminar', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days', 'Астана', false, 'Базовые знания Python и математики', 'external', 'https://nu.edu.kz/events/data-science', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Nazarbayev_University_logo.svg/200px-Nazarbayev_University_logo.svg.png'),
    ('NU Startup Pitch Day', 'День презентаций стартапов от студентов NU. Инвесторы, менторы, нетворкинг.', 'seminar', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days', 'Астана', false, 'Для студентов и выпускников NU', 'external', 'https://nu.edu.kz/events/pitch-day', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Nazarbayev_University_logo.svg/200px-Nazarbayev_University_logo.svg.png'),
    ('NU Blockchain Conference', 'Конференция о блокчейне и криптовалютах. Доклады от экспертов индустрии.', 'seminar', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', 'Астана', false, 'Открыто для всех', 'external', 'https://nu.edu.kz/events/blockchain', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Nazarbayev_University_logo.svg/200px-Nazarbayev_University_logo.svg.png'),
    
    -- События от Astana Hub (за последний месяц)
    ('Astana Hub Tech Meetup', 'Ежемесячная встреча tech-сообщества. Доклады о новых технологиях и трендах.', 'seminar', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', 'Астана', false, 'Регистрация обязательна', 'external', 'https://astanahub.com/events/meetup', 'https://astanahub.com/static/images/logo.svg'),
    ('Astana Hub AI Bootcamp', 'Интенсивный курс по искусственному интеллекту. Практические задания и проекты.', 'seminar', NOW() - INTERVAL '14 days', NOW() - INTERVAL '10 days', 'Астана', false, 'Базовые знания программирования', 'external', 'https://astanahub.com/events/ai-bootcamp', 'https://astanahub.com/static/images/logo.svg'),
    ('Astana Hub Startup Battle', 'Соревнование стартапов. Презентации перед жюри из инвесторов и экспертов.', 'tournament', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days', 'Астана', false, 'Для резидентов Astana Hub', 'external', 'https://astanahub.com/events/startup-battle', 'https://astanahub.com/static/images/logo.svg'),
    ('Astana Hub Web3 Summit', 'Саммит о Web3, NFT и метавселенных. Встречи с лидерами индустрии.', 'seminar', NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days', 'Астана', false, 'Открыто для всех', 'external', 'https://astanahub.com/events/web3-summit', 'https://astanahub.com/static/images/logo.svg')
) AS v(title, description, type, date_start, date_end, city, is_online, requirements, source, source_url, banner)
CROSS JOIN system_user
WHERE NOT EXISTS (
    SELECT 1 FROM events e 
    WHERE e.title = v.title 
    AND ABS(EXTRACT(EPOCH FROM (e.date_start - v.date_start))) < 86400  -- в пределах дня
)
RETURNING title;

