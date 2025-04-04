"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMailAndSend = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});
const setMailAndSend = ({ destinationEmail, subject, message }) => {
    if (destinationEmail) {
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
            }
            else {
                console.log('Email sent:', info.response);
            }
        });
    }
};
exports.setMailAndSend = setMailAndSend;
