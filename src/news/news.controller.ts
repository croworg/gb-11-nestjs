import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Render,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommentsService } from './comments/comments.service';
import { CreateNewsDto } from './dtos/create-news.dto';
import { UpdateNewsDto } from './dtos/update-news.dto';
import { HelperFileLoader } from '../utils/HelperFileLoader';
import { MailService } from '../mail/mail.service';
import { NewsService } from './news.service';
import { NewsEntity } from './news.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';

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
  async getAllView() {
    const news = await this.newsService.getAll();
    return { news, title: 'News list' };
  }

  @Get('create/new')
  @Render('create-news')
  async createView() {
    return {};
  }

  @Get('detail/:id')
  @Render('news-detail')
  async getNewsView(@Param('id', ParseIntPipe) id: number) {
    const news = await this.newsService.findById(id);
    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'News is not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return { news };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.Moderator)
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
  ): Promise<NewsEntity> {
    console.log(cover.originalname);
    const fileExtension = cover.originalname.split('.').reverse()[0];
    if (!fileExtension || !fileExtension.match(/(jpg|jpeg|png|gif)$/i)) {
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
    const createdNews = await this.newsService.create(news);

    return createdNews;
  }

  @Put('api/:id')
  async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() news: UpdateNewsDto,
  ): Promise<NewsEntity> {
    const newsEditable = await this.newsService.edit(id, news);
    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'News is not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return newsEditable;
  }

  @Delete('api/:id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<string> {
    const isRemoved = await this.newsService.remove(id);
    throw new HttpException(
      {
        status: HttpStatus.OK,
        error: isRemoved ? 'News removed' : 'Wrong news identifier',
      },
      HttpStatus.OK,
    );
  }

  @Get('api/all')
  async getAll(): Promise<NewsEntity[]> {
    return this.newsService.getAll();
  }

  @Get('api/detail/:id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<NewsEntity> {
    const news = this.newsService.findById(id);
    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'News is not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return news;
  }
}
