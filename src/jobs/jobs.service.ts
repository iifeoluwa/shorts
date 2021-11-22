import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';

import { StatsQueue } from 'src/config/constants';
import { IJobsService } from './interfaces/jobs.interface';

@Injectable()
export class JobsService implements IJobsService {
  private readonly logger: Logger = new Logger(JobsService.name);

  constructor(@InjectQueue(StatsQueue) private statsQueue: Queue) {}

  logUrlVisit(shortId: string) {
    this.logger.log(`Publishing visit event to queue for shortId: ${shortId}`);
    this.statsQueue.add({ shortId });
  }
}
