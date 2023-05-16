import { Injectable } from '@nestjs/common';

export interface News {
  id: number;
  title: string;
  description: string;
  author: string;
  countView: number;
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.ceil(max);
  return Math.floor(Math.random() * (max - min)) + min; // Min includes and max not.
}

@Injectable()
export class NewsService {
  private readonly news: News[] = [
    {
      id: 1,
      title: 'This is first news',
      description: 'Very first news! Keep in touch!',
      author: 'Admin',
      countView: 12,
    },
  ];

  getAll(): News[] {
    if (this.news.length === 0) {
      return [];
    }
    return this.news;
  }

  create(news: News): News {
    const preparedNews = {
      ...news,
      id: getRandomInt(0, 99999),
    };
    this.news.push(preparedNews);
    return preparedNews;
  }

  edit(id: number, news: News): boolean {
    const newsIndex = this.news.findIndex((item) => item.id === id);
    if (newsIndex !== -1) {
      this.news[newsIndex] = {
        ...news,
        id: id,
      };
      return true;
    }
    return false;
  }

  find(id: News['id']): News | undefined {
    return this.news.find((news) => news.id === id);
  }

  remove(id: number): boolean {
    const indexRemoveNews = this.news.findIndex((news) => news.id === id);
    if (indexRemoveNews !== -1) {
      this.news.splice(indexRemoveNews, 1);
      return true;
    }
    return false;
  }
}
