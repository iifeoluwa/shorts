import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { AppService } from './links/app.service';
import { LinksModule } from './links/links.module';
import { PersistenceModule } from './persistence/persistence.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LinksModule,
    PersistenceModule,
  ],
  providers: [AppService],
})
export class AppModule { }
