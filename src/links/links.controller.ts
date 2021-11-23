import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';

import {
  CreateLinkDto,
  CreateLinkResponseDto,
  GetOriginalUrlResponseDto,
} from './dtos/links.dto';
import { LinksService } from './links.service';

@ApiTags('Links')
@Controller({
  version: '1',
  path: '/links',
})
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @ApiOkResponse({
    description: 'Original url decoded from short url',
    type: GetOriginalUrlResponseDto,
  })
  @Get(':shortId')
  async getLink(@Param('shortId') shortId: string) {
    return this.linksService.getOriginalUrl(shortId);
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({
    description: 'Newly generated short url',
    type: CreateLinkResponseDto,
  })
  createLink(@Body() { url }: CreateLinkDto): Promise<CreateLinkResponseDto> {
    return this.linksService.createLink(url);
  }
}
