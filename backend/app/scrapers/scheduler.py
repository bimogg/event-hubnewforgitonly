import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from app.cron.scraper_job import scrape_events_job

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


async def start_scheduler():
    """
    Запускает планировщик задач для парсинга событий.
    Парсинг запускается каждые 5 минут в фоновом режиме.
    """
    logger.info("Starting event scraper scheduler...")

    # Запускаем парсинг сразу при старте приложения (в фоне, не блокируя)
    logger.info("Scheduling initial scrape on startup...")
    try:
        # Запускаем сразу при старте (через 10 секунд, чтобы дать время БД подключиться)
        from apscheduler.triggers.date import DateTrigger
        from datetime import datetime, timedelta
        
        initial_trigger = DateTrigger(run_date=datetime.now() + timedelta(seconds=10))
        scheduler.add_job(
            scrape_events_job,
            trigger=initial_trigger,
            id="initial_scrape",
            name="Initial event scrape",
            replace_existing=True,
        )
        logger.info("Initial scrape scheduled to run in 10 seconds")
    except Exception as e:
        logger.error(f"Error scheduling initial scrape: {e}", exc_info=True)

    # Добавляем задачу на запуск всех скраперов каждые 5 минут
    scheduler.add_job(
        scrape_events_job,
        trigger=IntervalTrigger(minutes=5),
        id="run_all_scrapers",
        name="Run all event scrapers",
        replace_existing=True,
    )

    scheduler.start()
    logger.info("✅ Event scraper scheduler started. Scrapers will run every 5 minutes.")


async def stop_scheduler():
    """Останавливает планировщик задач"""
    logger.info("Stopping event scraper scheduler...")
    scheduler.shutdown(wait=True)
    logger.info("Event scraper scheduler stopped.")

