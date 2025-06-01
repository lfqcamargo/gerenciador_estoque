export abstract class CacheRepository {
  abstract set(key: string, value: any, ttl?: number): Promise<void>;
  abstract get(key: string): Promise<any>;
  abstract delete(key: string): Promise<void>;
  abstract deleteMany(pattern: string): Promise<void>;
}
