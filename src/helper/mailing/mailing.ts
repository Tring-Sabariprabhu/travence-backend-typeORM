import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

interface MailOptions{
  destinationEmail: string
  subject: string
  message: string
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});
export const setMailAndSend = ({destinationEmail, subject, message}: MailOptions) => {
  if(destinationEmail){
    const mailOptions = {
      from: process.env.EMAIL,
      to: destinationEmail,
      subject: subject,
      html: message
    };
  
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }
  

}