-- Добавление тестового пользователя "алина"
-- Email: alina@example.com
-- Пароль: password123

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

