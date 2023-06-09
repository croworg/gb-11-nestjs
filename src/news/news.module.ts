import { forwardRef, Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './news.entity';
import { UsersModule } from '../users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../auth/role/roles.guard';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsEntity]),
    CommentsModule,
    MailModule,
    UsersModule,
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [TypeOrmModule.forFeature([NewsEntity]), NewsService],
})
export class NewsModule {}
