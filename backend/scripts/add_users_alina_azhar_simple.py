#!/usr/bin/env python3
"""
Простой скрипт для добавления пользователей Алина и Ажар через прямое SQL подключение
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

def add_users():
    """Добавляет пользователей alina@eventhub.kz и azhar@eventhub.kz"""
    try:
        # Подключаемся к БД
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        users = [
            {
                'email': 'alina@eventhub.kz',
                'password': 'alina123',
                'name': 'Алина'
            },
            {
                'email': 'azhar@eventhub.kz',
                'password': 'azhar123',
                'name': 'Ажар'
            }
        ]
        
        for user_data in users:
            # Генерируем хэш пароля
            hashed_password = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            # Проверяем, существует ли пользователь
            cur.execute("SELECT id, email FROM users WHERE email = %s", (user_data['email'],))
            existing = cur.fetchone()
            
            if existing:
                print(f"⚠️ Пользователь {user_data['name']} уже существует (ID: {existing[0]})")
                # Обновляем пароль
                cur.execute(
                    "UPDATE users SET hashed_password = %s, updated_at = NOW() WHERE email = %s",
                    (hashed_password, user_data['email'])
                )
                conn.commit()
                print(f"✅ Пароль для {user_data['name']} обновлен")
            else:
                # Создаем нового пользователя
                cur.execute(
                    """INSERT INTO users (email, hashed_password, role, is_active, resume_path, created_at, updated_at)
                       VALUES (%s, %s, %s, %s, %s, NOW(), NOW())""",
                    (user_data['email'], hashed_password, 'user', True, None)
                )
                conn.commit()
                print(f"✅ Пользователь {user_data['name']} успешно создан!")
            
            # Проверяем результат
            cur.execute("SELECT id, email, role, is_active FROM users WHERE email = %s", (user_data['email'],))
            user = cur.fetchone()
            
            print(f"\n📋 Данные пользователя {user_data['name']}:")
            print(f"   ID: {user[0]}")
            print(f"   Email: {user[1]}")
            print(f"   Роль: {user[2]}")
            print(f"   Активен: {user[3]}")
            print(f"   Пароль: {user_data['password']}")
            print()
        
        cur.close()
        conn.close()
        
        print("✅ Готово! Оба пользователя добавлены в базу данных.")
        
    except psycopg2.OperationalError as e:
        print(f"❌ Ошибка подключения к БД: {e}")
        print("\n💡 Попробуйте:")
        print("   1. Убедитесь, что БД запущена")
        print("   2. Проверьте параметры подключения в скрипте")
        print("   3. Или выполните SQL вручную через psql:")
        print(f"      psql -U {DB_CONFIG['user']} -d {DB_CONFIG['database']} -f backend/scripts/add_users_alina_azhar.sql")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    add_users()

