import { Link } from '..';

export type LinkCreate = {
  shortId: string;
  originalUrl: string;
};

export interface ILinkRepository {
  findByShortId(id: string): Promise<Link | null>;
  create: (input: LinkCreate) => Promise<Link>;
}
