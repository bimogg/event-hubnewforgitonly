import logging
import re
from datetime import datetime, timedelta
from typing import Any, Optional
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from app.scrapers.base_scraper import BaseScraper

logger = logging.getLogger(__name__)


class AstanaHubScraper(BaseScraper):
    """Парсер событий с сайта Astana Hub"""

    def __init__(self):
        # Используем конкретные страницы с событиями
        super().__init__("AstanaHub", "https://astanahub.com/ru/events")

    def parse(self, html: str) -> list[dict[str, Any]]:
        """Парсит HTML страницу Astana Hub и извлекает события"""
        soup = BeautifulSoup(html, "lxml")
        events = []

        try:
            # Ищем карточки событий - пробуем разные селекторы
            event_cards = soup.find_all("article", class_="card-item")
            
            if not event_cards:
                event_cards = soup.find_all(
                    ["article", "div"],
                    class_=lambda x: x and (
                        "card" in str(x).lower()
                        or "event" in str(x).lower()
                        or "post" in str(x).lower()
                    ),
                )
            
            # Если не нашли по классам, ищем по структуре
            if not event_cards:
                event_cards = soup.find_all(["article", "div", "li"], recursive=True)
                event_cards = [
                    card for card in event_cards
                    if (card.find("h1") or card.find("h2") or card.find("h3") or card.find("h4"))
                    and (card.find("a", href=True) or "astanahub.com" in str(card))
                    and len(card.get_text(strip=True)) > 50  # Фильтруем слишком короткие элементы
                ]

            logger.info(f"[{self.name}] Found {len(event_cards)} potential event cards")

            for i, card in enumerate(event_cards, 1):
                try:
                    event_data = self._parse_event_card(card)
                    if event_data and event_data.get("title"):
                        # Фильтруем только релевантные события
                        title_lower = event_data.get("title", "").lower()
                        if any(keyword in title_lower for keyword in [
                            "hackathon", "хакатон", "event", "событие", "workshop", 
                            "воркшоп", "seminar", "семинар", "competition", "конкурс",
                            "питч", "pitch", "митап", "meetup", "лекция", "lecture"
                        ]) or "astanahub" in str(card).lower():
                            logger.info(f"[{self.name}] ✅ Parsed event: {event_data.get('title')[:50]}")
                            events.append(event_data)
                        else:
                            logger.debug(f"[{self.name}] Skipped non-event: {event_data.get('title')[:50]}")
                    else:
                        logger.warning(f"[{self.name}] ❌ Failed to parse event card {i}")
                except Exception as e:
                    logger.warning(f"[{self.name}] Error parsing event card {i}: {e}", exc_info=True)
                    continue

        except Exception as e:
            logger.error(f"[{self.name}] Error parsing HTML: {e}")

        return events

    def _parse_event_card(self, card) -> Optional[dict[str, Any]]:
        """Парсит отдельную карточку события"""
        try:
            # 1. Заголовок
            title_elem = card.find("h3")
            if not title_elem:
                title_elem = card.find("h2") or card.find("h1") or card.find("h4")
            
            if not title_elem:
                return None
                
            title = title_elem.get_text(strip=True)
            if not title or len(title) < 5:
                return None

            # 2. Описание
            description = ""
            desc_candidates = card.find_all(["div", "p"])
            for desc in desc_candidates:
                if desc.find(["h1", "h2", "h3", "h4"]):
                    continue
                text = desc.get_text(strip=True)
                if (20 < len(text) < 1000 and 
                    text != title and 
                    not any(m in text.lower() for m in ["ноя", "дек", "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт"]) and
                    not re.match(r'^\d+:\d+', text)):
                    description = text
                    break

            # 3. Дата
            date_str = ""
            all_spans = card.find_all("span")
            for span in all_spans:
                text = span.get_text(strip=True)
                if any(m in text.lower() for m in ["ноя", "дек", "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт"]) or (":" in text and len(text) < 20):
                    date_str = text
                    break
            
            if date_str:
                start_date = self._parse_date(date_str)
            else:
                start_date = datetime.now() + timedelta(days=7)

            # 4. Локация
            location = ""
            for span in all_spans:
                text = span.get_text(strip=True)
                if (len(text) > 3 and len(text) < 30 and 
                    not any(m in text.lower() for m in ["ноя", "дек", "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт"]) and
                    ":" not in text and
                    text != date_str):
                    location = text
                    break
            
            if not location:
                location = "Астана"

            # 5. Ссылка
            source_url = None
            for attr_name in card.attrs:
                attr_value = str(card.get(attr_name, ""))
                if "astanahub.com" in attr_value or "/event/" in attr_value:
                    url_match = re.search(r"https?://[^\s'\"\)]+", attr_value)
                    if url_match:
                        source_url = url_match.group(0)
                        break
            
            if not source_url:
                all_links = card.find_all("a", href=True)
                for link in all_links:
                    href = link.get("href", "")
                    if href and ("/event/" in href or "astanahub.com" in href):
                        source_url = urljoin(self.base_url, href) if not href.startswith("http") else href
                        break
            
            if not source_url:
                slug = re.sub(r'[^\w\s-]', '', title.lower())
                slug = re.sub(r'[-\s]+', '-', slug)[:50]
                source_url = f"{self.base_url}/ru/event/{slug}"

            # 6. Изображение
            image_url = None
            imgs = card.find_all("img")
            for img in imgs:
                img_src = img.get("src") or img.get("data-src") or img.get("data-lazy-src") or img.get("data-original")
                if img_src and not img_src.endswith(".svg") and not img_src.endswith(".gif"):
                    # Предпочитаем изображения, которые выглядят как баннеры событий
                    if any(keyword in img_src.lower() for keyword in ["event", "image", "photo", "banner", "cover"]):
                        image_url = urljoin(self.base_url, img_src) if not img_src.startswith("http") else img_src
                        break
                    elif not image_url:  # Если не нашли специальное, берем первое подходящее
                        image_url = urljoin(self.base_url, img_src) if not img_src.startswith("http") else img_src
            
            # Если не нашли изображение, используем логотип Astana Hub
            if not image_url:
                image_url = "https://astanahub.com/static/images/logo.png"

            # 7. Категория
            category = "other"
            title_lower = title.lower()
            desc_lower = description.lower()
            if "хакатон" in title_lower or "hackathon" in title_lower:
                category = "hackathon"
            elif "турнир" in title_lower or "tournament" in title_lower:
                category = "tournament"
            elif any(x in title_lower or x in desc_lower for x in ["семинар", "workshop", "воркшоп", "лекция", "lecture", "митап", "meetup"]):
                category = "seminar"

            # 8. Онлайн/офлайн
            is_online = "онлайн" in location.lower() or "online" in location.lower()

            return {
                "title": title,
                "description": description,
                "start_date": start_date,
                "end_date": None,
                "location": location,
                "category": category,
                "source_url": source_url,
                "image_url": image_url,
                "is_online": is_online,
                "tags": [],
            }

        except Exception as e:
            logger.warning(f"[{self.name}] Error parsing event card: {e}", exc_info=True)
            return None

    def _parse_date(self, date_str: str) -> datetime:
        """Парсит строку с датой в datetime объект"""
        if not date_str:
            return datetime.now() + timedelta(days=7)

        date_str = date_str.strip()
        
        months_ru = {
            "янв": 1, "фев": 2, "мар": 3, "апр": 4, "май": 5, "июн": 6,
            "июл": 7, "авг": 8, "сен": 9, "окт": 10, "ноя": 11, "дек": 12
        }
        
        # Формат "18 Ноя, 10:00"
        match = re.match(r"(\d+)\s+(\w+),?\s+(\d+):(\d+)", date_str)
        if match:
            day = int(match.group(1))
            month_name = match.group(2).lower()[:3]
            hour = int(match.group(3))
            minute = int(match.group(4))
            
            if month_name in months_ru:
                month = months_ru[month_name]
                year = datetime.now().year
                if month < datetime.now().month or (month == datetime.now().month and day < datetime.now().day):
                    year += 1
                return datetime(year, month, day, hour, minute)
        
        # Стандартные форматы
        date_formats = [
            "%Y-%m-%d %H:%M",
            "%d.%m.%Y %H:%M",
            "%d/%m/%Y %H:%M",
            "%Y-%m-%d",
            "%d.%m.%Y",
            "%d/%m/%Y",
        ]

        for fmt in date_formats:
            try:
                return datetime.strptime(date_str, fmt)
            except ValueError:
                continue

        logger.warning(f"[{self.name}] Could not parse date: {date_str}")
        return datetime.now() + timedelta(days=7)
