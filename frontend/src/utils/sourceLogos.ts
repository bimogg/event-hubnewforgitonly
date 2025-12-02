/**
 * Утилита для определения логотипов источников событий
 */

export interface SourceInfo {
  logo: string;
  name: string;
}

const SOURCE_LOGOS: Record<string, SourceInfo> = {
  'nu.edu.kz': {
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Nazarbayev_University_logo.svg/200px-Nazarbayev_University_logo.svg.png',
    name: 'Nazarbayev University'
  },
  'astanahub.com': {
    logo: 'https://astanahub.com/static/images/logo.svg',
    name: 'Astana Hub'
  },
  'aitu.edu.kz': {
    logo: 'https://aitu.edu.kz/static/images/logo.png',
    name: 'AITU'
  },
  'kbtu.edu.kz': {
    logo: 'https://kbtu.edu.kz/static/images/logo.png',
    name: 'KBTU'
  },
  'iitu.edu.kz': {
    logo: 'https://iitu.edu.kz/static/images/logo.png',
    name: 'IITU'
  },
  'nfactorial.ai': {
    logo: 'https://nfactorial.ai/static/images/logo.png',
    name: 'nFactorial'
  },
  'techorda.kz': {
    logo: 'https://techorda.kz/static/images/logo.png',
    name: 'TechOrda'
  }
};

/**
 * Получает информацию об источнике по URL
 */
export function getSourceInfo(sourceUrl: string | null): SourceInfo | null {
  if (!sourceUrl) return null;
  
  try {
    const url = new URL(sourceUrl);
    const hostname = url.hostname.replace('www.', '');
    
    // Ищем точное совпадение
    for (const [domain, info] of Object.entries(SOURCE_LOGOS)) {
      if (hostname.includes(domain)) {
        return info;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Получает логотип источника, используя banner или определяя по URL
 */
export function getSourceLogo(sourceUrl: string | null, banner: string | null): string | null {
  // Если есть banner, используем его
  if (banner) return banner;
  
  // Иначе определяем по URL
  const sourceInfo = getSourceInfo(sourceUrl);
  return sourceInfo?.logo || null;
}

/**
 * Получает название источника
 */
export function getSourceName(sourceUrl: string | null): string | null {
  const sourceInfo = getSourceInfo(sourceUrl);
  return sourceInfo?.name || null;
}

