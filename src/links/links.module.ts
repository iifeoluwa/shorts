import { Module } from '@nestjs/common';

import { PersistenceModule } from 'src/persistence/persistence.module';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';

@Module({
  imports: [PersistenceModule],
  controllers: [LinksController],
  providers: [LinksService]
})
export class LinksModule { }
