"""
Сервис для запуска всех скраперов параллельно
"""
import logging
import asyncio
from typing import Dict, List

from app.scrapers.astana_hub_scraper import AstanaHubScraper
from app.scrapers.aitu_scraper import AITUScraper
from app.scrapers.nfactorial_scraper import NFactorialScraper
from app.scrapers.techorda_scraper import TechOrdaScraper
from app.scrapers.nu_scraper import NUScraper

logger = logging.getLogger(__name__)


async def run_all_scrapers() -> Dict[str, int]:
    """
    Запускает все скраперы параллельно и возвращает статистику.
    Если скрапер падает - возвращает 0, не ломая весь процесс.
    
    Returns:
        Dict[str, int]: Словарь с результатами {scraper_name: events_count}
    """
    logger.info("=" * 60)
    logger.info("Starting all scrapers in parallel...")
    logger.info("=" * 60)

    scrapers = [
        AstanaHubScraper(),
        NUScraper(),
        AITUScraper(),
        NFactorialScraper(),
        TechOrdaScraper(),
    ]

    async def run_scraper_safe(scraper) -> tuple[str, int]:
        """
        Безопасно запускает скрапер с обработкой всех ошибок.
        Возвращает (name, count) или (name, 0) в случае ошибки.
        """
        scraper_name = scraper.name
        try:
            logger.info(f"[{scraper_name}] Starting scraper...")
            count = await scraper.scrape()
            logger.info(f"[{scraper_name}] ✅ Completed: {count} events processed")
            return scraper_name, count
        except Exception as e:
            logger.error(
                f"[{scraper_name}] ❌ Failed: {e}",
                exc_info=True
            )
            return scraper_name, 0
        finally:
            try:
                await scraper.close()
            except Exception as e:
                logger.warning(f"[{scraper_name}] Error closing client: {e}")

    # Запускаем все скраперы параллельно
    tasks = [run_scraper_safe(scraper) for scraper in scrapers]
    results_list = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Обрабатываем результаты
    results: Dict[str, int] = {}
    for result in results_list:
        if isinstance(result, Exception):
            logger.error(f"Scraper task failed with exception: {result}", exc_info=True)
            continue
        if isinstance(result, tuple) and len(result) == 2:
            name, count = result
            results[name] = count
        else:
            logger.warning(f"Unexpected result format: {result}")

    total = sum(results.values())
    successful = sum(1 for count in results.values() if count > 0)
    
    logger.info("=" * 60)
    logger.info(f"All scrapers completed.")
    logger.info(f"Successful: {successful}/{len(scrapers)}")
    logger.info(f"Total events processed: {total}")
    logger.info(f"Results: {results}")
    logger.info("=" * 60)

    return results

