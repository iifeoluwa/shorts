import { ConfigService } from '@nestjs/config';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CacheServiceToken, LinkRepositoryToken } from 'src/config/constants';

import { generateID } from 'src/utils/ids.util';
import { ICache } from 'src/persistence/interfaces/cache.interface';
import { ILinkRepository } from 'src/persistence/interfaces/repository/link.repository';

@Injectable()
export class LinksService {
  private logger: Logger = new Logger(LinksService.name);

  constructor(
    @Inject(LinkRepositoryToken) private linksRepository: ILinkRepository,
    @Inject(CacheServiceToken) private cacheService: ICache,
    private config: ConfigService,
  ) {}

  async getOriginalUrl(shortUrl: string) {
    let originalUrl = await this.cacheService.get(shortUrl);

    if (!originalUrl) {
      this.logger.log(
        `No cached entry found for url-${shortUrl}. Checking in db.`,
      );
      const link = await this.linksRepository.findByShortUrl(shortUrl);

      if (!link) {
        this.logger.log(`Entry for url-${shortUrl} not found in db.`);
        throw new NotFoundException(`Invalid url`);
      }

      this.logger.log(
        `Database entry found for url-${shortUrl}. Caching value...`,
      );
      originalUrl = link.originalUrl;
      this.cacheService.set(shortUrl, originalUrl);
    }

    return originalUrl;
  }

  async createLink(originalUrl: string) {
    try {
      const shortUrl = await this.generateUniqueShortUrl();
      const link = await this.linksRepository.create({ originalUrl, shortUrl });
      this.cacheService.set(shortUrl, originalUrl);

      return link;
    } catch (error) {
      this.logger.error(
        'Error while processing link creation request',
        JSON.stringify(error),
      );
      throw new InternalServerErrorException(
        'An error occurred while processing your request. Kindly try again.',
      );
    }
  }

  async generateUniqueShortUrl() {
    const shortUrlLength = this.config.get<number>('app.shortUrlLength');

    this.logger.log(`Generating url identifier.`);
    let shortUrl = await generateID(shortUrlLength);
    let urlExists = await this.linksRepository.findByShortUrl(shortUrl);
    let collissions = 0;

    while (urlExists) {
      shortUrl = await generateID(shortUrlLength);
      urlExists = await this.linksRepository.findByShortUrl(shortUrl);
      collissions++;
    }

    this.logger.log(
      `Finished generating unique url identifier. Encountered ${collissions} collisions`,
    );
    return shortUrl;
  }
}
