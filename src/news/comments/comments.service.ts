import { Injectable } from '@nestjs/common';
import { getRandomInt } from '../news.service';

export type Comment = {
  id?: number;
  message: string;
  author: string;
  idNews: number;
};

@Injectable()
export class CommentsService {
  private readonly comments = {};

  create(idNews: number, comment: Comment) {
    if (!this.comments[idNews]) {
      this.comments[idNews] = [];
    }

    this.comments[idNews].push({ ...comment, id: getRandomInt() });
    return `Комментарий был создан`;
  }

  find(idNews: number): Comment[] | null {
    return this.comments[idNews] || null;
  }

  edit(idNews: number, idComment: number, message: string): Comment[] | null {
    if (!this.comments[idNews]) {
      return null;
    }

    const indexComment = this.comments[idNews].findIndex(
      (c) => c.id === idComment,
    );
    if (indexComment === -1) {
      return null;
    }
    const editedComment = { ...this.comments[idNews][indexComment], message };

    return (this.comments[idNews][indexComment] = editedComment);
  }

  remove(idNews: number, idComment: number): Comment[] | null {
    if (!this.comments[idNews]) {
      return null;
    }

    const indexComment = this.comments[idNews].findIndex(
      (c) => c.id === idComment,
    );
    if (indexComment === -1) {
      return null;
    }

    return this.comments[idNews].splice(indexComment, 1);
  }
}
