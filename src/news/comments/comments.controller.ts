import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Comment, CommentsService } from './comments.service';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../../utils/HelperFileLoader';

const PATH_COMMENTS = '/news-static/';
// const helperFileLoaderComment = new HelperFileLoader();
HelperFileLoader.path = PATH_COMMENTS;

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('api/:idNews')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: HelperFileLoader.destinationPath,
        filename: HelperFileLoader.customFileName,
      }),
    }),
  )
  create(
    @Param('idNews') idNews: string,
    @Body() comment: CreateCommentDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    if (avatar?.filename) {
      comment.avatar = PATH_COMMENTS + avatar.filename;
    }
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
    @Param('idNews', ParseIntPipe) idNews: number,
    @Param('idComment', ParseIntPipe) idComment: number,
    @Body() comment: UpdateCommentDto,
  ) {
    return this.commentsService.edit(idNews, idComment, comment);
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
