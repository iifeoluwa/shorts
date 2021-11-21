import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CreateLinkDto } from './dtos/links.dto';
import { LinksService } from './links.service';

@Controller('/links')
export class LinksController {
  constructor(private readonly linksService: LinksService) { }

  @Get(':shortUrl')
  getLink(@Param('shortUrl') shortUrl: string) {
    return this.linksService.getOriginalUrl(shortUrl);
  }

  @Post()
  @HttpCode(201)
  createLink(@Body() { url }: CreateLinkDto) {
    return this.linksService.createLink(url);
  }
}
