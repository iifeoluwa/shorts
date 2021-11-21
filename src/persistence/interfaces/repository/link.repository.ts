import { Link } from '..';

export type LinkCreate = {
  shortUrl: string;
  originalUrl: string;
};

export interface ILinkRepository {
  findByShortUrl(url: string): Promise<Link | null>;
  create: (input: LinkCreate) => Promise<Link>;
}
