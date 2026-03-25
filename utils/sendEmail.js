
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
        text,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }
                .content {
                    padding: 20px;
                }
                .otp-box {
                    background-color: #e8f5e9;
                    border: 2px solid #4CAF50;
                    padding: 20px;
                    text-align: center;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .otp-code {
                    font-size: 36px;
                    font-weight: bold;
                    color: #2E7D32;
                    letter-spacing: 8px;
                }
                .footer {
                    margin-top: 20px;
                    padding-top: 10px;
                    border-top: 1px solid #dddddd;
                    font-size: 12px;
                    color: #777777;
                    text-align: center;
                }
                .button {
                    display: inline-block;
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 15px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Jewellery Management System</h1>
                </div>
                <div class="content">
                    <h2>${subject}</h2>
                    <p>Dear User,</p>
                    <p>${text}</p>
                    
                    ${otp ? `
                    <div class="otp-box">
                        <p>Your One-Time Password (OTP) is:</p>
                        <div class="otp-code">${otp}</div>
                    </div>
                    ` : ''}
                    
                    <p>If you did not request this, please ignore this email.</p>
                    <p>Thank you!</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Jewellery Management System. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `
    });

    console.log(info.messageId);

    return true;
};

export { sendEmail }