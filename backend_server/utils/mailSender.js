const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async(email, title, body) => {
    try{
        // create Transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASSWORD
            }
        });

        // send mail
        let info = await transporter.sendMail({
            from: "SkilNova - by Bhivanshu Lawaniya",
            to: email,
            subject: title,
            html: body
        })

        // console.log("INFO : ",info);
    }catch(err){
        console.log(err.message);
    }
}

module.exports = mailSender;