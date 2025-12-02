import logging
from datetime import datetime
from typing import Any, Optional
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from app.scrapers.base_scraper import BaseScraper

logger = logging.getLogger(__name__)


class TechOrdaScraper(BaseScraper):
    """Парсер событий с сайта TechOrda"""

    def __init__(self):
        super().__init__("TechOrda", "https://techorda.kz/events")

    async def fetch_html(self, url: str) -> str:
        """Переопределяем для проверки альтернативных URL"""
        try:
            return await super().fetch_html(url)
        except Exception:
            # Если основной URL не работает, пробуем альтернативные варианты
            alt_urls = [
                "https://www.techorda.kz/events",
                "https://techorda.kz/en/events",
                "https://techorda.kz/ru/events",
            ]
            for alt_url in alt_urls:
                try:
                    logger.info(f"[{self.name}] Trying alternative URL: {alt_url}")
                    return await super().fetch_html(alt_url)
                except Exception:
                    continue
            raise

    def parse(self, html: str) -> list[dict[str, Any]]:
        """Парсит HTML страницу TechOrda и извлекает события"""
        soup = BeautifulSoup(html, "lxml")
        events = []

        try:
            # Ищем контейнеры с событиями
            event_cards = soup.find_all(
                ["article", "div", "li"],
                class_=lambda x: x and (
                    "event" in x.lower()
                    or "card" in x.lower()
                    or "post" in x.lower()
                    or "item" in x.lower()
                    or "workshop" in x.lower()
                ),
            )

            # Если не нашли по классам, ищем по структуре
            if not event_cards:
                event_cards = soup.find_all(["article", "div"], recursive=True)
                event_cards = [
                    card
                    for card in event_cards
                    if (card.find("h1") or card.find("h2") or card.find("h3"))
                    and (card.find("a", href=True) or card.find("time"))
                ]

            logger.info(f"[{self.name}] Found {len(event_cards)} potential event cards")

            for card in event_cards:
                try:
                    event_data = self._parse_event_card(card)
                    if event_data and event_data.get("title"):
                        events.append(event_data)
                except Exception as e:
                    logger.warning(f"[{self.name}] Error parsing event card: {e}")
                    continue

        except Exception as e:
            logger.error(f"[{self.name}] Error parsing HTML: {e}")

        return events

    def _parse_event_card(self, card) -> Optional[dict[str, Any]]:
        """Парсит отдельную карточку события"""
        try:
            # Извлекаем заголовок
            title_elem = (
                card.find("h1")
                or card.find("h2")
                or card.find("h3")
                or card.find("h4")
                or card.find("a", class_=lambda x: x and "title" in x.lower())
                or card.find("strong")
                or card.find("b")
            )
            title = title_elem.get_text(strip=True) if title_elem else ""

            if not title:
                return None

            # Извлекаем ссылку
            link_elem = card.find("a", href=True) or (title_elem.find("a", href=True) if title_elem else None)
            relative_url = link_elem.get("href", "") if link_elem else ""
            source_url = urljoin(self.base_url, relative_url) if relative_url else None

            # Извлекаем описание
            desc_elem = (
                card.find("p")
                or card.find("div", class_=lambda x: x and ("description" in x.lower() or "content" in x.lower() or "summary" in x.lower() or "excerpt" in x.lower()))
                or card.find("span", class_=lambda x: x and "text" in x.lower())
            )
            description = desc_elem.get_text(strip=True) if desc_elem else ""

            # Извлекаем дату
            date_elem = (
                card.find("time")
                or card.find("span", class_=lambda x: x and ("date" in x.lower() or "time" in x.lower()))
                or card.find("div", class_=lambda x: x and ("date" in x.lower() or "datetime" in x.lower()))
            )
            date_str = date_elem.get_text(strip=True) if date_elem else ""
            if date_elem and date_elem.get("datetime"):
                date_str = date_elem.get("datetime")
            start_date = self._parse_date(date_str)

            # Извлекаем изображение
            img_elem = card.find("img")
            image_url = None
            if img_elem:
                img_src = img_elem.get("src") or img_elem.get("data-src") or img_elem.get("data-lazy-src") or img_elem.get("data-original")
                if img_src:
                    image_url = urljoin(self.base_url, img_src)

            # Извлекаем локацию
            location_elem = (
                card.find("span", class_=lambda x: x and ("location" in x.lower() or "place" in x.lower() or "venue" in x.lower() or "address" in x.lower()))
                or card.find("div", class_=lambda x: x and ("location" in x.lower() or "address" in x.lower() or "venue" in x.lower()))
                or card.find("i", class_=lambda x: x and ("location" in x.lower() or "map" in x.lower()))
            )
            location = location_elem.get_text(strip=True) if location_elem else ""
            
            # Для TechOrda по умолчанию ставим Астану, если локация не указана
            if not location:
                location = "Астана"

            # Определяем категорию
            category = "other"
            category_elem = card.find("span", class_=lambda x: x and ("category" in x.lower() or "tag" in x.lower() or "type" in x.lower()))
            if category_elem:
                category_text = category_elem.get_text(strip=True).lower()
                if "hackathon" in category_text:
                    category = "hackathon"
                elif "seminar" in category_text or "workshop" in category_text or "lecture" in category_text or "training" in category_text:
                    category = "seminar"
                elif "tournament" in category_text or "competition" in category_text or "contest" in category_text:
                    category = "tournament"
                elif "quest" in category_text:
                    category = "quest"

            # Проверяем, является ли событие онлайн
            is_online = False
            if location:
                is_online = "online" in location.lower() or "онлайн" in location.lower() or "zoom" in location.lower() or "meet" in location.lower()
            else:
                # Если локация не указана, проверяем другие признаки
                online_indicators = card.find_all(string=lambda text: text and ("online" in text.lower() or "онлайн" in text.lower()))
                if online_indicators:
                    is_online = True

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
            logger.warning(f"[{self.name}] Error parsing event card: {e}")
            return None

    def _parse_date(self, date_str: str) -> datetime:
        """Парсит строку с датой в datetime объект"""
        if not date_str:
            return datetime.now()

        date_formats = [
            "%Y-%m-%d",
            "%d.%m.%Y",
            "%d/%m/%Y",
            "%Y-%m-%d %H:%M",
            "%d.%m.%Y %H:%M",
            "%B %d, %Y",
            "%d %B %Y",
            "%Y-%m-%dT%H:%M:%S",
            "%Y-%m-%dT%H:%M",
            "%d %B, %Y",
            "%B %d, %Y %H:%M",
            "%Y-%m-%dT%H:%M:%S%z",
            "%Y-%m-%dT%H:%M:%SZ",
        ]

        for fmt in date_formats:
            try:
                return datetime.strptime(date_str.strip(), fmt)
            except ValueError:
                continue

        logger.warning(f"[{self.name}] Could not parse date: {date_str}, using current date")
        return datetime.now()

