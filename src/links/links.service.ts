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
  private readonly urlBase: string;
  private readonly shortIDLength: number;
  private readonly logger: Logger = new Logger(LinksService.name);

  constructor(
    @Inject(LinkRepositoryToken) private linksRepository: ILinkRepository,
    @Inject(CacheServiceToken) private cacheService: ICache,
    private config: ConfigService,
  ) {
    this.urlBase = this.config.get('app.urlBase');
    this.shortIDLength = this.config.get<number>('app.shortIDLength');
  }

  async getOriginalUrl(shortUrl: string) {
    let originalUrl = await this.cacheService.get(shortUrl);

    if (!originalUrl) {
      this.logger.log(
        `No cached entry found for url-${shortUrl}. Checking in db.`,
      );
      const link = await this.linksRepository.findByShortId(shortUrl);

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

    return { originalUrl };
  }

  async createLink(originalUrl: string) {
    try {
      const shortId = await this.generateUniqueShortID();

      await this.linksRepository.create({ originalUrl, shortId });
      this.cacheService.set(shortId, originalUrl);

      return {
        originalUrl,
        shortUrl: `${this.urlBase}/${shortId}`
      };
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

  async generateUniqueShortID() {
    this.logger.log(`Generating url identifier.`);
    let shortId = await generateID(this.shortIDLength);
    let urlExists = await this.linksRepository.findByShortId(shortId);
    let collissions = 0;

    while (urlExists) {
      shortId = await generateID(this.shortIDLength);
      urlExists = await this.linksRepository.findByShortId(shortId);
      collissions++;
    }

    this.logger.log(
      `Finished generating unique url identifier. Encountered ${collissions} collisions`,
    );
    return shortId;
  }
}
