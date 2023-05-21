import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Comment, CommentsService, CommentEdit } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('api/:idNews')
  create(@Param('idNews') idNews: string, @Body() comment: Comment) {
    const idNewsInt = parseInt(idNews);
    return this.commentsService.create(idNewsInt, comment);
  }

  @Get('api/:idNews')
  get(@Param('idNews') idNews: string): Comment[] {
    const idNewsInt = parseInt(idNews);
    return this.commentsService.find(idNewsInt);
  }

  @Put('api/:idNews/:idComment')
  edit(
    @Param('idNews') idNews: string,
    @Param('idComment') idComment: string,
    @Body() comment: CommentEdit,
  ) {
    const idNewsInt = parseInt(idNews);
    const idCommentInt = parseInt(idComment);
    return this.commentsService.edit(idNewsInt, idCommentInt, comment);
  }

  @Delete('api/:idNews/:idComment')
  remove(
    @Param('idNews') idNews: string,
    @Param('idComment') idComment: string,
  ) {
    const idNewsInt = parseInt(idNews);
    const idCommentInt = parseInt(idComment);
    return this.commentsService.remove(idNewsInt, idCommentInt);
  }
}
