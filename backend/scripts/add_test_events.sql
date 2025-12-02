-- Скрипт для добавления тестовых событий из NU и Astana Hub

-- Создаем системного пользователя, если его нет
INSERT INTO users (email, hashed_password, full_name, role, created_at, updated_at)
SELECT 
    'system@eventhub.kz',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q5', -- хеш для "system"
    'System',
    'admin',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'system@eventhub.kz'
);

-- Получаем ID системного пользователя
DO $$
DECLARE
    system_user_id INTEGER;
BEGIN
    SELECT id INTO system_user_id FROM users WHERE email = 'system@eventhub.kz';

    -- События из NU
    INSERT INTO events (title, description, type, date_start, date_end, city, is_online, requirements, source, source_url, organizer_id, created_at, updated_at)
    VALUES
        (
            'HackNU 2025',
            'Крупнейший хакатон в Казахстане от Nazarbayev University. Соревнование по разработке инновационных решений в области AI, HealthTech и FinTech.',
            'hackathon',
            NOW() + INTERVAL '30 days',
            NOW() + INTERVAL '32 days',
            'Астана',
            false,
            'Студенты и выпускники университетов Казахстана. Команды 2-5 человек.',
            'external',
            'https://nu.edu.kz/hackathon',
            system_user_id,
            NOW(),
            NOW()
        ),
        (
            'NU Tech Summit 2025',
            'Ежегодная конференция о технологиях и инновациях. Доклады от ведущих экспертов, воркшопы и нетворкинг.',
            'seminar',
            NOW() + INTERVAL '45 days',
            NOW() + INTERVAL '45 days',
            'Астана',
            false,
            'Открыто для всех',
            'external',
            'https://nu.edu.kz/tech-summit',
            system_user_id,
            NOW(),
            NOW()
        ),
        (
            'NU AI Challenge',
            'Соревнование по машинному обучению и искусственному интеллекту. Решайте реальные задачи от индустриальных партнеров.',
            'tournament',
            NOW() + INTERVAL '20 days',
            NOW() + INTERVAL '60 days',
            'Астана',
            true,
            'Знание Python, базовые навыки ML',
            'external',
            'https://nu.edu.kz/ai-challenge',
            system_user_id,
            NOW(),
            NOW()
        ),
        -- События из Astana Hub
        (
            'Astana Hub Hackathon 2025',
            'Международный хакатон от Astana Hub. Разработайте решение для цифровизации государственных услуг. Призовой фонд 5,000,000 ₸.',
            'hackathon',
            NOW() + INTERVAL '25 days',
            NOW() + INTERVAL '27 days',
            'Астана',
            false,
            'Команды 3-6 человек. Опыт разработки приветствуется.',
            'external',
            'https://astanahub.com/hackathon',
            system_user_id,
            NOW(),
            NOW()
        ),
        (
            'Startup Weekend Astana',
            '54 часа на создание стартапа. От идеи до MVP за выходные. Менторы, инвесторы, призы.',
            'hackathon',
            NOW() + INTERVAL '15 days',
            NOW() + INTERVAL '17 days',
            'Астана',
            false,
            'Любой желающий. Команды формируются на месте.',
            'external',
            'https://astanahub.com/startup-weekend',
            system_user_id,
            NOW(),
            NOW()
        ),
        (
            'TechTalks Astana Hub',
            'Еженедельные встречи разработчиков. Доклады о новых технологиях, обмен опытом, нетворкинг.',
            'seminar',
            NOW() + INTERVAL '7 days',
            NOW() + INTERVAL '7 days',
            'Астана',
            false,
            'Регистрация обязательна',
            'external',
            'https://astanahub.com/techtalks',
            system_user_id,
            NOW(),
            NOW()
        ),
        (
            'Blockchain Workshop',
            'Практический воркшоп по разработке на блокчейне. Создайте свой первый смарт-контракт.',
            'seminar',
            NOW() + INTERVAL '12 days',
            NOW() + INTERVAL '12 days',
            'Астана',
            false,
            'Базовые знания программирования',
            'external',
            'https://astanahub.com/blockchain-workshop',
            system_user_id,
            NOW(),
            NOW()
        )
    WHERE NOT EXISTS (
        SELECT 1 FROM events WHERE title = 'HackNU 2025' AND date_start = NOW() + INTERVAL '30 days'
    )
    AND NOT EXISTS (
        SELECT 1 FROM events WHERE title = 'NU Tech Summit 2025' AND date_start = NOW() + INTERVAL '45 days'
    )
    AND NOT EXISTS (
        SELECT 1 FROM events WHERE title = 'NU AI Challenge' AND date_start = NOW() + INTERVAL '20 days'
    )
    AND NOT EXISTS (
        SELECT 1 FROM events WHERE title = 'Astana Hub Hackathon 2025' AND date_start = NOW() + INTERVAL '25 days'
    )
    AND NOT EXISTS (
        SELECT 1 FROM events WHERE title = 'Startup Weekend Astana' AND date_start = NOW() + INTERVAL '15 days'
    )
    AND NOT EXISTS (
        SELECT 1 FROM events WHERE title = 'TechTalks Astana Hub' AND date_start = NOW() + INTERVAL '7 days'
    )
    AND NOT EXISTS (
        SELECT 1 FROM events WHERE title = 'Blockchain Workshop' AND date_start = NOW() + INTERVAL '12 days'
    );
END $$;

