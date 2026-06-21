const Cache = {
  _available: (function () {
    try { const k = CACHE_PREFIX + "_test"; localStorage.setItem(k, "1"); localStorage.removeItem(k); return true; }
    catch { return false; }
  })(),
  get(key) {
    if (!this._available) return null;
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;
      const { data, expiry } = JSON.parse(raw);
      if (Date.now() > expiry) { localStorage.removeItem(CACHE_PREFIX + key); return null; }
      return data;
    } catch { return null; }
  },
  set(key, data, ttlMinutes) {
    if (!this._available) return;
    try { localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, expiry: Date.now() + ttlMinutes * 60 * 1000 })); }
    catch {}
  },
};
