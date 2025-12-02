-- Создание таблицы users и добавление пользователя "алина"

-- Создаем таблицу users (если не существует)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    resume_path VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем индекс на email
CREATE INDEX IF NOT EXISTS ix_users_email ON users(email);
CREATE INDEX IF NOT EXISTS ix_users_id ON users(id);

-- Добавляем пользователя "алина"
INSERT INTO users (email, hashed_password, role, is_active, resume_path, created_at, updated_at)
VALUES (
  'alina@example.com',
  '$2b$12$ZjNC2k.3TQW40kkVeRncFuIIBXeT3RSBa.KsnCgF83z/ji.ed.Eai',
  'user',
  true,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  hashed_password = EXCLUDED.hashed_password,
  updated_at = NOW();

-- Проверка
SELECT id, email, role, is_active, created_at FROM users WHERE email = 'alina@example.com';

