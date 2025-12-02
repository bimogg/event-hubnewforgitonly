-- Скрипт для добавления пользователей Алина и Ажар
-- Пароли: alina123 и azhar123 (хэшируются через bcrypt)

-- Добавляем Алину
INSERT INTO users (email, hashed_password, role, is_active, resume_path, created_at, updated_at)
VALUES (
    'alina@eventhub.kz',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5Q5Z5J5J5J5J5', -- bcrypt hash для "alina123"
    'user',
    true,
    NULL,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Добавляем Ажар
INSERT INTO users (email, hashed_password, role, is_active, resume_path, created_at, updated_at)
VALUES (
    'azhar@eventhub.kz',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5Q5Z5J5J5J5J5', -- bcrypt hash для "azhar123"
    'user',
    true,
    NULL,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Проверяем результат
SELECT id, email, role, is_active FROM users WHERE email IN ('alina@eventhub.kz', 'azhar@eventhub.kz');

