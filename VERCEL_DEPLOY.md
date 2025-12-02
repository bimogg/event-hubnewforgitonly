# Инструкция по деплою на Vercel

## Проблема 404 на Vercel

Если вы видите ошибку 404, это значит, что Vercel не знает, как правильно собрать и развернуть ваш проект.

## Решение

### Вариант 1: Через веб-интерфейс Vercel (Рекомендуется)

1. Зайдите на https://vercel.com
2. Откройте ваш проект `event-hubnewforgitonly`
3. Перейдите в **Settings** → **General**
4. Найдите секцию **Build & Development Settings**
5. Установите следующие настройки:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Framework Preset**: `Vite`

6. Сохраните настройки
7. Перейдите в **Deployments** и нажмите **Redeploy** на последнем деплое

### Вариант 2: Через vercel.json (уже создан)

Файл `vercel.json` уже создан в корне проекта. После коммита и push:

```bash
git add vercel.json frontend/vite.config.ts
git commit -m "Fix Vercel deployment configuration"
git push
```

Vercel автоматически пересоберет проект.

## Проверка

После деплоя ваш сайт должен открываться по адресу:
- `https://event-hubnewforgitonly.vercel.app`

## Если проблема осталась

1. Проверьте логи деплоя в Vercel Dashboard → Deployments → [ваш деплой] → Logs
2. Убедитесь, что:
   - В `frontend/package.json` есть скрипт `build`
   - Все зависимости установлены (`npm install` проходит успешно)
   - Нет ошибок компиляции TypeScript

## Настройка переменных окружения (если нужно)

Если frontend использует переменные окружения:
1. Vercel Dashboard → Settings → Environment Variables
2. Добавьте переменные с префиксом `VITE_` (например, `VITE_API_URL`)

