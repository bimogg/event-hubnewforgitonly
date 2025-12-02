#!/bin/bash
# Пробуем разные варианты URL логотипа
URLS=(
  "https://astanahub.com/static/images/logo.png"
  "https://astanahub.com/images/logo.png"
  "https://astanahub.com/assets/logo.png"
  "https://www.astanahub.com/logo.png"
  "https://astanahub.com/logo.png"
)

for url in "${URLS[@]}"; do
  echo "Пробую: $url"
  if curl -L -f -s "$url" -o astana-hub-logo.png 2>/dev/null; then
    if [ -s astana-hub-logo.png ]; then
      echo "✅ Успешно скачан: $url"
      file astana-hub-logo.png
      exit 0
    fi
  fi
done
echo "❌ Не удалось скачать логотип"
exit 1
