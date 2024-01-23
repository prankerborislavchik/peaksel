import nodemailer from "nodemailer";
import { registrationMail } from "./mails/registration";
import { resetPasswordMail } from "./mails/resetPassword";

interface IBaseSendMailData {
    to: string
}

interface ISendLoginMail extends IBaseSendMailData {
    activationToken: string
}
interface ISendRecoverPassMail extends IBaseSendMailData {
    resetToken: string
}

class MailService {

    private userGmail = process.env.EMAIL
    private userPassword = process.env.EMAIL_PASSWORD
    private transporter = nodemailer.createTransport({
        // host: process.env.HOST,
        // secure: true,
        service: 'gmail',
        auth: {
            user: this.userGmail,
            pass: this.userPassword
        },
    })
    
    public constructor() {}

    public async sendLoginMail({to, activationToken}: ISendLoginMail) {
        try {
            await this.transporter.sendMail({
                from: this.userGmail,
                to,
                html: registrationMail({activationToken}),
                subject: "Подтверждение регистрации в Пиксель"
            })   
        } catch (error) {
            console.log(error)
            throw new Error('Произошла ошибка при отправке сообщения')
        }
    }

    public async sendRecoverPasswordMail({to, resetToken}: ISendRecoverPassMail) {
        try {
            await this.transporter.sendMail({
                from: this.userGmail,
                to,
                html: resetPasswordMail({resetToken}),
                subject: "Восстановление пароля для входа в учётную запись на Пиксель"
            })   
        } catch (error) {
            console.log(error)
            throw new Error('Произошла ошибка при отправке сообщения')
        }
    }
}

const mailService = new MailService()

export default mailService