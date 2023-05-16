import {
  Controller,
  Param,
  Body,
  HttpCode,
  Res,
  Get,
  Post,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { News, NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  getAll(): News[] {
    return this.newsService.getAll();
  }

  @Get(':id')
  get(@Param('id') id: string): News {
    const idInt = parseInt(id);
    return this.newsService.find(idInt);
  }

  @Post()
  create(@Body() news: News): News {
    return this.newsService.create(news);
  }

  @Post(':id')
  edit(
    @Param('id') id,
    @Body() news: News,
    @Res({ passthrough: true }) res: Response,
  ): string {
    const newsId = parseInt(id);
    const isEdited = this.newsService.edit(newsId, news);
    if (isEdited) {
      res.status(HttpStatus.OK);
      return 'News edited successfully';
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    return 'Wrong news index';
  }

  @Delete(':id')
  remove(@Param('id') id: string): string {
    const idInt = parseInt(id);
    const isRemoved = this.newsService.remove(idInt);
    return isRemoved ? 'News deleted successfully' : 'Wrong news index!';
  }
}
