import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LinkDocument = Link & Document;

@Schema()
export class Link {

  @Prop()
  originalUrl: string;

  @Prop({ index: true })
  shortUrl: string;

  @Prop()
  visits: number;

}

export const LinkSchema = SchemaFactory.createForClass(Link);