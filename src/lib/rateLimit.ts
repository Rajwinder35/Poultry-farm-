type RateEntry = {
  count: number;
  start: number;
};

const rateStore = new Map<string, RateEntry>();

export function checkRateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const entry = rateStore.get(key);

  if (!entry || now - entry.start > windowMs) {
    rateStore.set(key, { count: 1, start: now });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  rateStore.set(key, entry);
  return { allowed: true, remaining: limit - entry.count };
}
