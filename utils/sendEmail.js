import { asyncHadler } from "./asyncHandler.js";
import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const info = await transporter.sendMail({
        from: { name: "Mansi Gohil", address: process.env.SMTP_USER },
        to,
        subject,
        text
    });

    console.log(info.messageId);

    return true;
};

export { sendEmail }