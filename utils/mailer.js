const nodemailer = require('nodemailer')

const transport  = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure : false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    }
})

const sendMail = async (to,subject,text) =>{
    try {
        await transport.sendMail({
            from: `RBAC Sytem ${process.env.SMTP_USER}`,
            to,
            subject,
            text
        })
        console.log("Email Sent Succesfully");
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail