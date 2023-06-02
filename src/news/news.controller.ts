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
  Render,
} from '@nestjs/common';
import { Response } from 'express';
import { News, NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import { renderTemplate } from '../views/template';
import { renderNews } from '../views/news/news';
import { CreateNewsDto } from './dtos/create-news.dto';
import { UpdateNewsDto } from './dtos/update-news.dto';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../utils/HelperFileLoader';
import { FileInterceptor } from '@nestjs/platform-express';
import { MailService } from '../mail/mail.service';

const PATH_NEWS = '/news-static/';
// const helperFileLoaderNews = new HelperFileLoader();
// helperFileLoaderNews.path = PATH_NEWS;
HelperFileLoader.path = PATH_NEWS;

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
    private readonly mailService: MailService,
  ) {}

  @Get('all')
  @Render('news-list')
  getAllView() {
    const news = this.newsService.getAll();
    return { news, title: 'News list' };
  }

  @Get('create/new')
  @Render('create-news')
  async createView() {
    return {};
  }

  @Get('detail/:id')
  @Render('news-detail')
  getNewsView(@Param('id') id: string) {
    const idInt = parseInt(id);
    const news = this.newsService.find(idInt);
    const comments = this.commentsService.find(idInt);

    return {
      news,
      comments,
    };
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
  async create(
    @Body() news: CreateNewsDto,
    @UploadedFile() cover: Express.Multer.File,
  ): Promise<News> {
    const fileExternsion = cover.originalname.split('.').reverse()[0];
    if (!fileExternsion || !fileExternsion.match(/(jpg|jpeg|png|gif)$/)) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Wrong image format',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (cover?.filename) {
      news.cover = PATH_NEWS + cover.filename;
    }
    const createdNews = this.newsService.create(news);
    await this.mailService.sendNewNewsForAdmins(
      ['ilya.croworg@gmail.com'],
      createdNews,
    );
    return createdNews;
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
