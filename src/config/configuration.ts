export default () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    shortIDLength: parseInt(process.env.SHORT_ID_LENGTH, 10) || 7,
    urlBase: process.env.LINK_BASE_URL || 'tier.app',
  },
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
  cache: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    ttl: process.env.CACHE_TTL || '43200',
  },
});
