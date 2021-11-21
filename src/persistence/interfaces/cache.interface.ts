export interface ICache {

  set(key: string, value: string, ttl?: number): void

  get(key: string): Promise<string | void>;

  exists(key: string): Promise<boolean>;

  delete(key: string): void

}