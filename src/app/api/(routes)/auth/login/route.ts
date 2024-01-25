import { NextRequest, NextResponse } from "next/server"
import { User } from "../../../DB/models/models"
import { z } from 'zod'
import { ErrorApi } from "@/app/api/services/error/errorApi"
import bcrypt from 'bcrypt'
import mailService from "@/app/api/services/email/MailService"
import { tokenService } from "@/app/api/services/token/tokenService"

export async function POST(request: NextRequest) {
    try {
        const ResponseSchema = z.object({
            email: z.string().trim()
                .min(1, "Поле email является обязательным для заполнения")
                .max(254, { message: "Слишком длинный email" })
                .email({ message: "Невалидный email" }),
            password: z.string().trim()
                .min(1, "Введите пароль")
                .max(65, "Слишком длинный пароль")
        })

        const data = ResponseSchema.safeParse(await request.json())

        if (!data.success) throw ErrorApi.badRequestValidation(data.error.errors)

        const { data: { email, password } } = data

        const candidate = await User.findOne({ where: { email } })

        if (!candidate) throw ErrorApi.badRequest("Пользователь с данным email не найден")
        //@ts-ignore
        if (!candidate.isActivated) {
            //@ts-ignore
            await mailService.sendLoginMail({ to: email, activationToken: candidate.activationToken })
            throw ErrorApi
                .badRequest(`Пользователь с данным email не активировал учётную запись. 
                Для активации учётной записи проверьте вашу почту. 
                Мы отправили вам повторное письмо для активации вашего аккаунта`)
        }
        // Сюда мы попадаем если пользователь зарегистрирован и подтвердил свой аккаунт        
        // @ts-ignore
        const arePasswordsEqual = await bcrypt.compare(password, candidate.password)

        if (!arePasswordsEqual) throw ErrorApi.badRequest("Неверный email или пароль")

        const response = NextResponse.json({ data: { message: "Успешная авторизация" } }, { status: 200 })
        response.cookies.set('authorization', tokenService.generateAT({
            // @ts-ignore
            id: candidate.id, roles: candidate.roles, email,
        }), {
            httpOnly: true,
            secure: false, //process.env.NODE_ENV === 'production',
            maxAge: 24 * 24 * 60 * 60,
            path: "/",
            sameSite: "strict",
        })

        return response
    } catch (error) {
        if (error instanceof ErrorApi) {
            const {status, ...err} = error
            return NextResponse.json({data: {...err}}, {status})
        }
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }


}