import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { JobsModule } from './jobs/jobs.module';
import { LinksModule } from './links/links.module';
import { PersistenceModule } from './persistence/persistence.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JobsModule,
    LinksModule,
    PersistenceModule,
  ],
})
export class AppModule {}
