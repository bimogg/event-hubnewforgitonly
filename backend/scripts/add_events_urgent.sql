-- СРОЧНО: Добавляем события напрямую в БД
-- Если таблицы нет - создаем её сначала

-- Создаем таблицу если её нет
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    organizer_id INTEGER,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    date_start TIMESTAMP NOT NULL,
    date_end TIMESTAMP,
    city VARCHAR(100),
    is_online BOOLEAN DEFAULT false,
    type VARCHAR(50),
    banner TEXT,
    requirements TEXT,
    tags TEXT[],
    source VARCHAR(50),
    source_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Удаляем старые тестовые события
DELETE FROM events WHERE id >= 9991;

-- Добавляем события Astana Hub
INSERT INTO events (id, title, description, date_start, date_end, city, is_online, type, banner, source_url, tags, source, created_at, updated_at) VALUES
(9991, 'Стань Scrum-мастером за 2 дня!', 'На Scrum School от Astana Hub ты освоишь гибкие методологии Scrum и Agile, чтобы управлять командами и проектами так, как это делают ведущие IT-компании мира.', '2025-11-28 09:00:00', '2025-11-29 13:00:00', 'Астана', true, 'seminar', 'https://astanahub.com/static/images/logo.svg', 'https://astanahub.com/en/event/stan-scrum-masterom-za-2-dnia', ARRAY['Scrum', 'Agile', 'Управление'], 'external', NOW(), NOW()),

(9992, 'Pizza Pitch! 🍕', 'Стартап на стадии MVP и выше? Представь свой проект экспертам и инвесторам — и поборись за призовой фонд 1 500 000 ₸.', '2025-11-18 15:00:00', NULL, 'Астана', false, 'tournament', 'https://astanahub.com/static/images/logo.svg', 'https://astanahub.com/en/event/pizza-pitch1763379282', ARRAY['Стартап', 'Питчинг', 'Инвестиции'], 'external', NOW(), NOW()),

(9993, '👑 IT Queen: твой проект заслуживает корону!', 'Конкурс для женщин-предпринимательниц и стартапов на стадии MVP. Питчинг перед экспертами, менторами и инвесторами.', '2025-11-28 15:30:00', NULL, 'Астана', false, 'tournament', 'https://astanahub.com/static/images/logo.svg', 'https://astanahub.com/en/event/it-queen-tvoi-proekt-zasluzhivaet-koronu1762510308', ARRAY['Стартап', 'Женщины', 'Конкурс'], 'external', NOW(), NOW()),

(9994, 'Воркшоп: Преврати хаос в порядок: собери свою систему в Notion за 2 часа', 'На этом воркшопе мы начнём с пустой страницы и соберём вашу личную систему управления жизнью и задачами — прямо в реальном времени.', '2025-11-28 15:00:00', '2025-11-28 17:00:00', NULL, true, 'seminar', 'https://astanahub.com/static/images/logo.svg', 'https://astanahub.com/en/event/vorkshop-prevrati-khaos-v-poriadok-soberi-svoiu-sistemu-v-notion-za-2-chasa', ARRAY['Notion', 'Продуктивность', 'Воркшоп'], 'external', NOW(), NOW()),

(9995, 'Как спроектировать приложение, которое выдержит миллион пользователей?', 'Мастер-класс от Влада Мишустина — основателя Warpflow и бывшего технического директора.', '2025-11-26 16:00:00', NULL, NULL, true, 'seminar', 'https://astanahub.com/static/images/logo.svg', 'https://astanahub.com/en/event/demo-day-market-entry-accelerator', ARRAY['Разработка', 'Архитектура', 'Масштабирование'], 'external', NOW(), NOW()),

(9996, 'HackNU 2025 - Крупнейший хакатон в Казахстане', 'Ежегодный хакатон от Nazarbayev University. Соревнование по разработке инновационных решений в области AI, HealthTech и FinTech.', NOW() + INTERVAL '30 days', NOW() + INTERVAL '32 days', 'Астана', false, 'hackathon', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Nazarbayev_University_logo.svg/200px-Nazarbayev_University_logo.svg.png', 'https://nu.edu.kz/hackathon', ARRAY['AI', 'HealthTech', 'FinTech', 'NU'], 'external', NOW(), NOW()),

(9997, 'Astana Hub Startup Day', 'День открытых дверей и питчей стартапов в Astana Hub. Представь свой проект экспертам и инвесторам.', NOW() + INTERVAL '15 days', NULL, 'Астана', false, 'tournament', 'https://astanahub.com/static/images/logo.svg', 'https://astanahub.com', ARRAY['Стартап', 'Питчинг', 'Astana Hub'], 'external', NOW(), NOW());

-- Проверяем результат
SELECT id, title, date_start, city FROM events ORDER BY date_start LIMIT 10;

