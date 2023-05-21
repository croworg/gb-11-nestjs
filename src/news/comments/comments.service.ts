import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { getRandomInt } from '../news.service';

export interface Comment {
  id?: number;
  message: string;
  author: string;
  idNews: number;
}

export type CommentEdit = Partial<Comment>;

@Injectable()
export class CommentsService {
  private readonly comments = {};

  create(idNews: number, comment: Comment) {
    if (!this.comments[idNews]) {
      this.comments[idNews] = [];
    }

    this.comments[idNews].push({
      ...comment,
      id: getRandomInt(),
    });

    return 'Комментарий добавлен';
  }

  find(idNews: number): Comment[] | null {
    return this.comments[idNews] || null;
  }

  edit(
    idNews: number,
    idComment: number,
    comment: CommentEdit,
  ): Comment[] | null {
    const indexComment = this.comments[idNews]?.findIndex(
      (c) => c.id === idComment,
    );
    if (!this.comments[idNews] || indexComment || indexComment === -1) {
      throw new HttpException('Comment not found', HttpStatus.BAD_REQUEST);
    }

    const editedComment = {
      ...this.comments[idNews][indexComment],
      ...comment,
    };
    this.comments[idNews][indexComment] = editedComment;

    return editedComment;
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
