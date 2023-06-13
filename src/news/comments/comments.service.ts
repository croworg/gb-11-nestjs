import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';
import { Repository } from 'typeorm';
import { NewsService } from '../news.service';
import { UsersService } from '../../users/users.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import EventEmitter2 from 'eventemitter2';
import {
  checkPermission,
  Modules,
} from '../../auth/role/utils/check-permission';

export interface Comment {
  id?: number;
  message: string;
  author: string;
  avatar: string;
  // idNews: number;
}

export type CommentEdit = Partial<Comment>;

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    private readonly newsService: NewsService,
    private readonly userService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private readonly comments = {};

  async create(
    idNews: number,
    comment: CreateCommentDto,
  ): Promise<CommentsEntity> {
    const _news = await this.newsService.findById(idNews);
    if (!_news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'News not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const _user = await this.userService.findById(comment.userId);
    if (!_user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const commentEntity = new CommentsEntity();
    commentEntity.news = _news;
    commentEntity.message = comment.message;
    commentEntity.user = _user;

    return this.commentsRepository.save(commentEntity);
  }

  async findAll(idNews: number): Promise<CommentsEntity[]> {
    return this.commentsRepository.find({
      where: { id: idNews },
      relations: ['user'],
    });
  }

  async edit(idComment: number, comment: CommentEdit): Promise<CommentsEntity> {
    const _comment = await this.commentsRepository.findOne({
      where: {
        id: idComment,
      },
      relations: ['news', 'user'],
    });
    _comment.message = comment.message;
    const _updatedComment = await this.commentsRepository.save(_comment);
    this.eventEmitter.emit(EventsComment.edit, {
      commentId: idComment,
      newsId: _comment.news.id,
      comment: _updatedComment,
    });
    return _updatedComment;
    // return this.commentsRepository.save(_comment);
  }

  async remove(idComment: number, userId: number): Promise<CommentsEntity> {
    const _comment = await this.commentsRepository.findOne({
      where: {
        id: idComment,
      },
      relations: ['news', 'user'],
    });
    if (!_comment) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Comment not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const _user = await this.userService.findById(userId);
    if (
      _user.id !== _comment.user.id &&
      !checkPermission(Modules.editComment, _user.roles)
    ) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Not enough rights for remove',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return this.commentsRepository.remove(_comment);
  }

  async removeAll(idNews) {
    const _comments = await this.findAll(idNews);
    return await this.commentsRepository.remove(_comments);
  }
}
