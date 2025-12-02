#!/usr/bin/env python3
"""
Простой скрипт для добавления пользователя "алина" через прямое SQL подключение
"""
import psycopg2
import bcrypt
import sys

# Параметры подключения (измените если нужно)
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'eventhub',
    'user': 'eventhub',
    'password': 'eventhub'
}

def add_user_alina():
    """Добавляет пользователя alina@example.com"""
    try:
        # Подключаемся к БД
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Генерируем хэш пароля
        password = "password123"
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Проверяем, существует ли пользователь
        cur.execute("SELECT id, email FROM users WHERE email = %s", ('alina@example.com',))
        existing = cur.fetchone()
        
        if existing:
            print(f"✅ Пользователь уже существует (ID: {existing[0]})")
            # Обновляем пароль
            cur.execute(
                "UPDATE users SET hashed_password = %s, updated_at = NOW() WHERE email = %s",
                (hashed_password, 'alina@example.com')
            )
            conn.commit()
            print("✅ Пароль обновлен")
        else:
            # Создаем нового пользователя
            cur.execute(
                """INSERT INTO users (email, hashed_password, role, is_active, resume_path, created_at, updated_at)
                   VALUES (%s, %s, %s, %s, %s, NOW(), NOW())""",
                ('alina@example.com', hashed_password, 'user', True, None)
            )
            conn.commit()
            print("✅ Пользователь успешно создан!")
        
        # Проверяем результат
        cur.execute("SELECT id, email, role, is_active FROM users WHERE email = %s", ('alina@example.com',))
        user = cur.fetchone()
        
        print(f"\n📋 Данные пользователя:")
        print(f"   ID: {user[0]}")
        print(f"   Email: {user[1]}")
        print(f"   Роль: {user[2]}")
        print(f"   Активен: {user[3]}")
        print(f"\n🔑 Данные для входа:")
        print(f"   Email: alina@example.com")
        print(f"   Пароль: password123")
        
        cur.close()
        conn.close()
        
    except psycopg2.OperationalError as e:
        print(f"❌ Ошибка подключения к БД: {e}")
        print("\n💡 Попробуйте:")
        print("   1. Убедитесь, что БД запущена")
        print("   2. Проверьте параметры подключения в скрипте")
        print("   3. Или выполните SQL вручную через psql:")
        print(f"      psql -U {DB_CONFIG['user']} -d {DB_CONFIG['database']} -f backend/scripts/add_test_user_alina.sql")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        sys.exit(1)

if __name__ == "__main__":
    add_user_alina()

