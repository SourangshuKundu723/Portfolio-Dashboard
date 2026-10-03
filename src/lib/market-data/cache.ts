type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class MarketDataCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private ongoingRequests = new Map<string, Promise<unknown>>();

  async getOrFetch<T>(
    key: string,
    ttlSeconds: number,
    fetchFn: () => Promise<T>
  ): Promise<T> {
    const now = Date.now();
    const entry = this.cache.get(key);

    if (entry && now - entry.timestamp < ttlSeconds * 1000) {
      return entry.data as T;
    }

    if (this.ongoingRequests.has(key)) {
      return this.ongoingRequests.get(key) as Promise<T>;
    }

    const requestPromise = fetchFn().then(
      (data) => {
        this.cache.set(key, { data, timestamp: Date.now() });
        this.ongoingRequests.delete(key);
        return data;
      },
      (error) => {
        this.ongoingRequests.delete(key);
        throw error;
      }
    );

    this.ongoingRequests.set(key, requestPromise);
    return requestPromise;
  }
}

export const marketDataCache = new MarketDataCache();
