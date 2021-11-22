import { BullModule } from '@nestjs/bull';
import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JobsServiceToken, StatsQueue } from 'src/config/constants';
import { PersistenceModule } from 'src/persistence/persistence.module';
import { StatsConsumer } from './consumers/stats.consumer';
import { JobsService } from './jobs.service';

const JobsServiceProvider: Provider = {
  provide: JobsServiceToken,
  useClass: JobsService,
};

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('cache.host'),
          port: configService.get('cache.port'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: StatsQueue,
    }),
    PersistenceModule,
  ],
  providers: [StatsConsumer, JobsServiceProvider],
  exports: [JobsServiceProvider],
})
export class JobsModule {}
