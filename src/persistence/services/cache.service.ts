import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache as CacheManager } from 'cache-manager';
import { ICache } from '../interfaces/cache.interface';

@Injectable()
export class CacheService implements ICache {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: CacheManager) {}

  get(key: string) {
    return this.cacheManager.get<string>(key);
  }

  set(key: string, value: string, ttl?: number) {
    this.cacheManager.set(key, value, ttl);
  }

  async exists(key: string) {
    const value = await this.get(key);

    return !!value;
  }

  delete(key: string) {
    return this.cacheManager.del(key);
  }
}
