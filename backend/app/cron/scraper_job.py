"""
CRON задача для периодического запуска скраперов
"""
import logging

from app.services.scraper_service import run_all_scrapers

logger = logging.getLogger(__name__)


async def scrape_events_job():
    """
    CRON задача для запуска парсинга событий.
    Вызывается планировщиком каждые 5 минут.
    """
    try:
        logger.info("🔄 CRON: Starting scheduled event scraping...")
        results = await run_all_scrapers()
        logger.info(f"✅ CRON: Scraping completed. Results: {results}")
    except Exception as e:
        # Логируем ошибку, но не пробрасываем - чтобы CRON продолжал работать
        logger.error(f"❌ CRON: Error in scraping job: {e}", exc_info=True)

