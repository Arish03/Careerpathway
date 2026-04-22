import { logger } from './logger';

const cache = new Map<string, string>();

export const connectRedis = async (): Promise<void> => {
  logger.info('✅ Mock Redis connected (in-memory)');
};

export const getRedis = (): any => {
  return null;
};

export const setCache = async (key: string, value: any, ttl = 300) => {
  cache.set(key, JSON.stringify(value));
  if (ttl) {
    setTimeout(() => cache.delete(key), ttl * 1000);
  }
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  const data = cache.get(key);
  return data ? JSON.parse(data) : null;
};

export const delCache = async (...keys: string[]) => {
  for (const key of keys) {
    cache.delete(key);
  }
};
