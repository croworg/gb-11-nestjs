import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comments/comments.service';
import { NewsEntity } from './dtos/news.entity';
import { Repository } from 'typeorm';

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
  ) {}

  getAll(): Promise<NewsEntity[]> {
    return this.newsRepository.find({});
  }

  findById(id): Promise<NewsEntity> {
    return this.newsRepository.findOneBy({ id: id });
  }

  async create(news: News): Promise<NewsEntity> {
    const newsEntity = new NewsEntity();
    newsEntity.title = news.title;
    newsEntity.description = news.description;
    newsEntity.cover = news.cover;
    return this.newsRepository.save(news);
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
