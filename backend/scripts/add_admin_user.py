#!/usr/bin/env python3
"""
Скрипт для добавления администратора в базу данных
"""
import psycopg2
import bcrypt
import sys

# Параметры подключения
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'eventhub',
    'user': 'eventhub',
    'password': 'eventhub'
}

def add_admin():
    """Добавляет администратора admin@eventhub.kz"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Данные администратора
        email = 'admin@eventhub.kz'
        password = 'admin123'
        
        # Генерируем хэш пароля
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Проверяем, существует ли пользователь
        cur.execute("SELECT id, email FROM users WHERE email = %s", (email,))
        existing = cur.fetchone()
        
        if existing:
            print(f"⚠️ Администратор уже существует (ID: {existing[0]})")
            # Обновляем пароль и роль
            cur.execute(
                "UPDATE users SET hashed_password = %s, role = %s, updated_at = NOW() WHERE email = %s",
                (hashed_password, 'admin', email)
            )
            conn.commit()
            print("✅ Пароль и роль обновлены")
        else:
            # Создаем нового администратора
            cur.execute(
                """INSERT INTO users (email, hashed_password, role, is_active, resume_path, created_at, updated_at)
                   VALUES (%s, %s, %s, %s, %s, NOW(), NOW())""",
                (email, hashed_password, 'admin', True, None)
            )
            conn.commit()
            print("✅ Администратор успешно создан!")
        
        # Проверяем результат
        cur.execute("SELECT id, email, role, is_active FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        
        print(f"\n📋 Данные администратора:")
        print(f"   ID: {user[0]}")
        print(f"   Email: {user[1]}")
        print(f"   Роль: {user[2]}")
        print(f"   Активен: {user[3]}")
        print(f"\n🔑 Данные для входа:")
        print(f"   Email: {email}")
        print(f"   Пароль: {password}")
        
        cur.close()
        conn.close()
        
    except psycopg2.OperationalError as e:
        print(f"❌ Ошибка подключения к БД: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    add_admin()

