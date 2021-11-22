import { ConfigService } from '@nestjs/config';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IJobsService } from 'src/jobs/interfaces/jobs.interface';
import { ICache } from 'src/persistence/interfaces/cache.interface';
import { ILinkRepository } from 'src/persistence/interfaces/repository/link.repository';
import {
  CacheServiceToken,
  JobsServiceToken,
  LinkRepositoryToken,
} from 'src/config/constants';
import { LinksService } from 'src/links/links.service';

const LinkRepositoryStub = {
  findByShortId: jest.fn(),
  create: jest.fn(),
};

const JobsServiceStub = {
  logUrlVisit: jest.fn(),
};

const CacheServiceStub = {
  set: jest.fn(),
  get: jest.fn(),
};

describe('LinksService', () => {
  let service: LinksService;
  let linkRepository: ILinkRepository;
  let jobsService: IJobsService;
  let cacheService: ICache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        {
          provide: LinkRepositoryToken,
          useValue: LinkRepositoryStub,
        },
        {
          provide: JobsServiceToken,
          useValue: JobsServiceStub,
        },
        {
          provide: CacheServiceToken,
          useValue: CacheServiceStub,
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(LinksService);
    jobsService = module.get(JobsServiceToken);
    cacheService = module.get(CacheServiceToken);
    linkRepository = module.get(LinkRepositoryToken);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getOriginalUrl()', () => {
    it('should not make a database call if id is cached', async () => {
      const url = 'tier.app';
      const jobSpy = jest.spyOn(jobsService, 'logUrlVisit');
      const linkRepositorySpy = jest.spyOn(linkRepository, 'findByShortId');
      const cacheGetSpy = jest
        .spyOn(cacheService, 'get')
        .mockResolvedValue(url);

      const result = await service.getOriginalUrl('fv3tG8t');

      expect(jobSpy).toHaveBeenCalled();
      expect(cacheGetSpy).toHaveBeenCalled();
      expect(linkRepositorySpy).toHaveBeenCalledTimes(0);
      expect(result.originalUrl).toEqual(url);
    });

    it('should throw an error if id is not valid', async () => {
      const jobSpy = jest.spyOn(jobsService, 'logUrlVisit');
      const findIdSpy = jest
        .spyOn(linkRepository, 'findByShortId')
        .mockResolvedValue(null);
      const cacheGetSpy = jest
        .spyOn(cacheService, 'get')
        .mockResolvedValue(null);

      await expect(service.getOriginalUrl('fv3tG8t')).rejects.toThrowError(
        NotFoundException,
      );
      expect(jobSpy).toHaveBeenCalledTimes(0);
      expect(cacheGetSpy).toHaveBeenCalled();
      expect(findIdSpy).toHaveBeenCalled();
    });

    it('should make a database call if id is not cached', async () => {
      const url = 'tier.app';
      const shortId = 'fv3tG8t';
      const jobSpy = jest.spyOn(jobsService, 'logUrlVisit');
      const cacheGetSpy = jest
        .spyOn(cacheService, 'get')
        .mockResolvedValue(null);
      const linkRepositorySpy = jest
        .spyOn(linkRepository, 'findByShortId')
        .mockResolvedValue({ originalUrl: url, shortId });

      const result = await service.getOriginalUrl(shortId);

      expect(jobSpy).toHaveBeenCalled();
      expect(cacheGetSpy).toHaveBeenCalled();
      expect(linkRepositorySpy).toHaveBeenCalled();
      expect(result.originalUrl).toEqual(url);
    });
  });

  describe('createLink()', () => {
    it('should create and cache a new link entry', async () => {
      const url = 'tier.app';
      const createSpy = jest.spyOn(linkRepository, 'create');
      const cacheSetSpy = jest.spyOn(cacheService, 'set');

      const result = await service.createLink(url);

      expect(cacheSetSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalled();
      expect(result).toHaveProperty('shortUrl');
      expect(result.originalUrl).toEqual(url);
    });

    it('should throw a server error if something goes wrong', async () => {
      const createSpy = jest
        .spyOn(linkRepository, 'create')
        .mockRejectedValue(null);
      const cacheSetSpy = jest.spyOn(cacheService, 'set');

      await expect(service.createLink('fv3tG8t')).rejects.toThrowError(
        InternalServerErrorException,
      );
      expect(cacheSetSpy).toHaveBeenCalledTimes(0);
      expect(createSpy).toHaveBeenCalled();
    });
  });
});
