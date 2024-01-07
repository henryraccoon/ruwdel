const nodemailer = require('nodemailer');
const pug = require('pug');
const Transport = require('nodemailer-brevo-transport');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.from = `Henndiy P. <${process.env.EMAIL_FROM}>`;
    this.url = url;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport(
        new Transport({
          apiKey: process.env.BREVO_API_KEY,
        })
      );
    }

    return nodemailer.createTransport(
      new Transport({
        apiKey: process.env.BREVO_API_KEY,
      })
    );
    // return nodemailer.createTransport({
    //   // service: 'Gmail',
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });
  }

  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html, {
        wordwrap: false,
      }),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to rUWDEL!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token. (valid for 10 minutes)'
    );
  }
};
