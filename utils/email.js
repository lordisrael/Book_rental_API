const nodemailer = require('nodemailer')
require('dotenv').config()

const sendEmail = async(option) => {
    // const transport = nodemailer.createTransport({
    //     host: "sandbox.smtp.mailtrap.io",
    //     port: 2525,
    //     auth: {
    //       user: "b1cdeda8726e99",
    //       pass: "cfee965479abd6"
    //     }
    //   });
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        // tls: {
        //     rejectUnauthorized: false
        // }
    })
    const emailOptions = {
        from: 'CineBook support<support@cinebook.com>',
        to: option.email,
        subject: option.subject,
        text: option.message
    }
    //await transporter.sendMail(emailOptions)
    try {
        await transport.sendMail(emailOptions);
        console.log('Email sent successfully');
      } catch (error) {
        console.error('Failed to send email:', error);
      }
      

}

module.exports = sendEmail