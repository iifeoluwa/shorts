import { IsString, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @IsUrl()
  url: string;
}

export class GetOriginalUrlResponseDto {
  @IsString()
  originalUrl: string;
}

export class CreateLinkResponseDto extends GetOriginalUrlResponseDto {
  @IsString()
  shortUrl: string;
}
