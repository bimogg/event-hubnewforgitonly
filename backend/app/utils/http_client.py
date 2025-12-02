"""
HTTP клиент с таймаутами и автоматическими ретраями
"""
import logging
import asyncio
from typing import Optional
import httpx

logger = logging.getLogger(__name__)


class HttpClient:
    """HTTP клиент с таймаутами и ретраями"""
    
    def __init__(
        self,
        timeout: float = 5.0,
        max_retries: int = 3,
        retry_delay: float = 1.0,
    ):
        self.timeout = timeout
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.client = httpx.AsyncClient(
            timeout=timeout,
            follow_redirects=True,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
        )
    
    async def get(self, url: str) -> Optional[str]:
        """
        Выполняет GET запрос с автоматическими ретраями
        
        Returns:
            str: HTML содержимое страницы или None в случае ошибки
        """
        last_error = None
        
        for attempt in range(1, self.max_retries + 1):
            try:
                logger.debug(f"Fetching {url} (attempt {attempt}/{self.max_retries})")
                response = await self.client.get(url)
                response.raise_for_status()
                return response.text
            except httpx.TimeoutException as e:
                last_error = e
                logger.warning(f"Timeout fetching {url} (attempt {attempt}/{self.max_retries})")
                if attempt < self.max_retries:
                    await asyncio.sleep(self.retry_delay * attempt)
            except httpx.HTTPError as e:
                last_error = e
                logger.warning(f"HTTP error fetching {url} (attempt {attempt}/{self.max_retries}): {e}")
                if attempt < self.max_retries:
                    await asyncio.sleep(self.retry_delay * attempt)
            except Exception as e:
                last_error = e
                logger.error(f"Unexpected error fetching {url} (attempt {attempt}/{self.max_retries}): {e}")
                if attempt < self.max_retries:
                    await asyncio.sleep(self.retry_delay * attempt)
        
        logger.error(f"Failed to fetch {url} after {self.max_retries} attempts: {last_error}")
        return None
    
    async def close(self):
        """Закрывает HTTP клиент"""
        try:
            await self.client.aclose()
        except Exception as e:
            logger.warning(f"Error closing HTTP client: {e}")

