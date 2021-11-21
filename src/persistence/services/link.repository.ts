import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Link as LinkSchema, LinkDocument } from '../schemas/link.schema';
import {
  ILinkRepository,
  LinkCreate,
} from '../interfaces/repository/link.repository';

@Injectable()
export class LinkRepository implements ILinkRepository {
  constructor(
    @InjectModel(LinkSchema.name) private linkModel: Model<LinkDocument>,
  ) {}

  create(input: LinkCreate) {
    return this.linkModel.create(input);
  }

  findByShortUrl(shortUrl: string) {
    return this.linkModel.findOne({ shortUrl }).exec();
  }
}
