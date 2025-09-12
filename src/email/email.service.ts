import { Injectable } from '@nestjs/common';
import { createTransport, Transporter} from 'nodemailer';

@Injectable()
export class EmailService {

    transporter: Transporter
    
    constructor() {
      this.transporter = createTransport({
          host: "smtp.qq.com",
          port: 587,
          secure: false,
          auth: {
              user: '1129524155@qq.com',
              pass: 'sdtjmamwyfmvghdg'
          },
      });
    }

    async sendMail({ to, subject, html }) {
      await this.transporter.sendMail({
        from: {
          name: '聊天室',
          address: '1129524155@qq.com'
        },
        to,
        subject,
        html
      });
    }
}