import { ConfigService } from '@nestjs/config';
import { CacheModule, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as redisStore from 'cache-manager-ioredis';

import { Link, LinkSchema } from './schemas/link.schema';
import { CacheServiceToken, LinkRepositoryToken } from 'src/config/constants';
import { LinkRepository, CacheService } from './services';

const LinkRepositoryProvider: Provider = {
  provide: LinkRepositoryToken,
  useClass: LinkRepository,
};

const CacheServiceProvider: Provider = {
  provide: CacheServiceToken,
  useClass: CacheService,
};

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database.url'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('cache.host'),
        port: configService.get('cache.port'),
        ttl: configService.get('cache.ttl'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LinkRepositoryProvider, CacheServiceProvider],
  exports: [LinkRepositoryProvider, CacheServiceProvider],
})
export class PersistenceModule {}
