# Быстрый запуск фронтенда на другом ноутбуке

## 1. Клонировать репозиторий
```bash
git clone https://github.com/AzharZu/eventhub-clean.git
cd eventhub-clean
```

## 2. Перейти в папку фронтенда
```bash
cd frontend
```

## 3. Установить зависимости
```bash
npm install
```

## 4. (Опционально) Настроить переменные окружения
Создайте файл `.env` в папке `frontend/`:
```bash
VITE_API_URL=http://localhost:8000
```

Или если бэкенд на другом сервере:
```bash
VITE_API_URL=https://your-backend-url.com
```

## 5. Запустить фронтенд
```bash
npm run dev
```

Фронтенд запустится на `http://localhost:5173`

---

## Если нужно собрать для продакшена:
```bash
npm run build
```

Собранные файлы будут в папке `frontend/dist/`

