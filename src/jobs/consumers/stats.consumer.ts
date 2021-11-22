import { Processor, Process } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { LinkRepositoryToken, StatsQueue } from 'src/config/constants';
import { ILinkRepository } from 'src/persistence/interfaces/repository/link.repository';

type IncrementJobData = { shortId: string };
@Processor(StatsQueue)
export class StatsConsumer {
  private readonly logger: Logger = new Logger(StatsConsumer.name);

  constructor(
    @Inject(LinkRepositoryToken) private linkRepository: ILinkRepository,
  ) {}

  @Process()
  async incrementVisitCount({ data: { shortId } }: Job<IncrementJobData>) {
    this.logger.log(`Incrementing visit stat for shortId: ${shortId}`);
    return this.linkRepository.incrementVisit(shortId);
  }
}
