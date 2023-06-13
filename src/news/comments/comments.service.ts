import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';
import { Repository } from 'typeorm';
import { NewsService } from '../news.service';
import { UsersService } from '../../users/users.service';
import { CreateCommentDto } from './dtos/create-comment.dto';

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

  async edit(
    // idNews: number,
    idComment: number,
    comment: CommentEdit,
  ): Promise<CommentsEntity> {
    const _comment = await this.commentsRepository.findOneBy({ id: idComment });
    _comment.message = comment.message;
    return this.commentsRepository.save(_comment);
  }

  async remove(
    // idNews: number,
    idComment: number,
  ): Promise<CommentsEntity> {
    const _comment = await this.commentsRepository.findOne({
      where: {
        id: idComment,
      },
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
    console.log(_comment);
    return this.commentsRepository.remove(_comment);
  }

  async removeAll(idNews) {
    const _comments = await this.findAll(idNews);
    return await this.commentsRepository.remove(_comments);
  }
}
