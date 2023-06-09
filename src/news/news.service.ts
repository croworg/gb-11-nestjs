import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comments/comments.service';
import { NewsEntity } from './news.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateNewsDto } from './dtos/create-news.dto';

export interface News {
  id?: number;
  title: string;
  description: string;
  author: string;
  countView?: number;
  comments?: Comment[];
  cover?: string;
}

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private newsRepository: Repository<NewsEntity>,
    private usersService: UsersService,
  ) {}

  getAll(): Promise<NewsEntity[]> {
    return this.newsRepository.find({});
  }

  findById(id): Promise<NewsEntity> {
    return this.newsRepository.findOne({
      where: { id: id },
      relations: ['user', 'comments', 'comments.user'],
    });
  }

  async create(news: CreateNewsDto): Promise<NewsEntity> {
    const newsEntity = new NewsEntity();
    newsEntity.title = news.title;
    newsEntity.description = news.description;
    newsEntity.cover = news.cover;
    const _user = await this.usersService.findById(parseInt(news.userId));
    newsEntity.user = _user;
    return this.newsRepository.save(newsEntity);
  }

  async edit(id: number, news: News): Promise<NewsEntity | null> {
    const editableNews = await this.findById(id);
    if (editableNews) {
      const newsEntity = new NewsEntity();
      newsEntity.title = news.title || editableNews.title;
      newsEntity.description = news.description || editableNews.description;
      newsEntity.cover = news.cover || editableNews.cover;
      return this.newsRepository.save(newsEntity);
    }
    return null;
  }

  async remove(id: News['id']): Promise<NewsEntity | null> {
    const indexRemoveNews = await this.findById(id);
    if (indexRemoveNews) {
      return this.newsRepository.remove(indexRemoveNews);
    }
    return null;
  }
}
