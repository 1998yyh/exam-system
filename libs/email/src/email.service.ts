import { Injectable } from '@nestjs/common';
import { createTransport, Transport } from 'nodemailer';

const MyEmailAddress = '532438158@qq.com';
const MyEmailPassword = 'dtkhkxmyekthbhce';

@Injectable()
export class EmailService {
  transporter: Transport;
  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: MyEmailAddress,
        pass: MyEmailPassword,
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '考试系统',
        address: MyEmailAddress,
      },
      to,
      subject,
      html,
    });
  }
}
