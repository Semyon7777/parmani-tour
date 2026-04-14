// const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 часа

// const CACHE_TTL = 1000 * 60; // 1 минута (60 000 миллисекунд)

const CACHE_TTL = 0; // aranc spaselu

export function getCached(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // если localStorage переполнен — просто пропускаем
  }
}