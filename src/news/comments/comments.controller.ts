import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { HelperFileLoader } from '../../utils/HelperFileLoader';
import { CommentsEntity } from './comments.entity';
import {
  checkPermission,
  Modules,
} from '../../auth/role/utils/check-permission';

const PATH_COMMENTS = '/news-static/';
// const helperFileLoaderComment = new HelperFileLoader();
HelperFileLoader.path = PATH_COMMENTS;

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('api/:idNews')
  create(
    @Param('idNews', ParseIntPipe) idNews: number,
    @Body() comment: CreateCommentDto,
  ): Promise<CommentsEntity> {
    return this.commentsService.create(idNews, comment);
  }

  @Get('api/:idNews')
  get(
    @Param('idNews', ParseIntPipe) idNews: number,
  ): Promise<CommentsEntity[]> {
    return this.commentsService.findAll(idNews);
  }

  @Put('api/:idComment')
  edit(
    @Param('idComment', ParseIntPipe) idComment: number,
    @Body() comment: UpdateCommentDto,
  ): Promise<CommentsEntity> {
    return this.commentsService.edit(idComment, comment);
  }

  @Delete('api/:idNews/:idComment')
  remove(@Param('idComment', ParseIntPipe) idComment: number, @Req() req) {
    const userId = req.user.id;
    return this.commentsService.remove(idComment, userId);
  }
}
