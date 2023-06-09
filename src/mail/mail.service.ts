import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { News } from '../news/news.service';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTest() {
    console.log('Sending email..');
    return await this.mailerService
      .sendMail({
        to: 'ilya.croworg@gmail.com',
        subject: 'The first test email',
        template: './test',
      })
      .then((res) => {
        console.log('res', res);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  async sendNewNewsForAdmins(emails: string[], news: News) {
    // console.log('Notification about added news!');

    for (const email of emails) {
      await this.mailerService
        .sendMail({
          to: email,
          subject: `News ${news.title} just added`,
          template: './new-news',
          context: news,
        })
        .then((res) => {
          console.log('res', res);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }
}
