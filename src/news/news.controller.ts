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
  HttpException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { News, NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import { renderNewsAll } from '../views/news/news-all';
import { renderTemplate } from '../views/template';
import { renderNews } from '../views/news/news';
import { CreateNewsDto } from './dtos/create-news.dto';
import { UpdateNewsDto } from './dtos/update-news.dto';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../utils/HelperFileLoader';
import { FileInterceptor } from '@nestjs/platform-express';

const PATH_NEWS = '/news-static/';
HelperFileLoader.path = PATH_NEWS;

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get('all')
  getAllView() {
    const news = this.newsService.getAll();
    const content = renderNewsAll(news);
    return renderTemplate(content, {
      title: 'Список новостей',
      description: 'Самые крутые новости на свете!',
    });
  }

  @Get(':id/detail')
  getNewsView(@Param('id') id: string): string {
    const idInt = parseInt(id);
    const news = this.newsService.find(idInt);
    const comments = this.commentsService.find(idInt);
    const content = renderNews(news, comments);
    return renderTemplate(content, {
      title: news.title,
      description: news?.description,
    });
  }

  @Get('api/all')
  @HttpCode(HttpStatus.OK)
  getAll(): News[] {
    return this.newsService.getAll();
  }

  @Get('api/:id')
  get(@Param('id') id: string): News {
    const idInt = parseInt(id);
    const news = this.newsService.find(idInt);
    const comments = this.commentsService.find(idInt);

    return {
      ...news,
      comments,
    };
  }

  @Post('api')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: HelperFileLoader.destinationPath,
        filename: HelperFileLoader.customFileName,
      }),
    }),
  )
  create(
    @Body() news: CreateNewsDto,
    @UploadedFile() cover: Express.Multer.File,
  ): News {
    if (cover?.filename) {
      news.cover = PATH_NEWS + cover.filename;
    }
    return this.newsService.create(news);
  }

  @Post('api/:id')
  edit(
    @Param('id') id,
    @Body() news: UpdateNewsDto,
    @Res({ passthrough: true }) res: Response,
  ): string {
    const newsId = parseInt(id);
    const isEdited = this.newsService.edit(newsId, news);
    if (!isEdited) {
      // res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException('Wrong news index', HttpStatus.BAD_REQUEST);
      // return 'Wrong news index';
    }
    // res.status(HttpStatus.OK);
    return 'News edited successfully';
  }

  @Delete('api/:id')
  remove(@Param('id') id: string): string {
    const idInt = parseInt(id);
    const isRemoved = this.newsService.remove(idInt);
    return isRemoved ? 'News deleted successfully' : 'Wrong news index!';
  }
}
