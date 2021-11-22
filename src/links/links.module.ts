import { Module } from '@nestjs/common';

import { PersistenceModule } from 'src/persistence/persistence.module';
import { LinksController } from './links.controller';
import { JobsModule } from 'src/jobs/jobs.module';
import { LinksService } from './links.service';

@Module({
  imports: [PersistenceModule, JobsModule],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
