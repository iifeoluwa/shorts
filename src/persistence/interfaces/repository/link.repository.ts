import { Link } from '..';

export type LinkCreate = {
  shortId: string;
  originalUrl: string;
};

export interface ILinkRepository {
  findByShortId(shortId: string): Promise<Link | null>;
  create: (input: LinkCreate) => Promise<Link>;
  incrementVisit(shortId: string): Promise<Link | null>;
}
