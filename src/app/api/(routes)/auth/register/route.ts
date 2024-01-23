import { NextRequest, NextResponse } from "next/server";
import { Cart, User } from "../../../DB/models/models";
import bcrypt from 'bcrypt'
import { z } from "zod";
import { ErrorApi } from "@/app/api/services/error/errorApi";
import { nanoid } from "nanoid";
import mailService from "@/app/api/services/email/MailService";
export async function POST(request: NextRequest) {

    try {
        const ResponseSchema = z.object({
            name: z.string().trim()
                .nonempty({ message: "Имя пользователя не может быть пустым" })
                .min(2, 'Имя должно состоять из 2ух и более букв')
                .max(24, "Слишком длинное имя"),
            email: z.string().trim()
                .nonempty({ message: "Поле email является обязательным для заполнения" })
                .max(254, { message: "Слишком длинный email" })
                .email({ message: "Невалидный email" }),
            password: z.string().trim()
                .nonempty({ message: "Введите пароль" })
                .max(65, "Слишком длинный пароль")
        })

        const response = ResponseSchema.safeParse(await request.json())

        if (!response.success) {
            throw ErrorApi.badRequestValidation(response.error.errors)
        }
        const { data: { email, name, password } } = response

        const candidate = await User.findOne({
            where: {
                email
            }
        })

        if (candidate) {
            throw ErrorApi.badRequest("Пользователь с данным email уже зарегистрирован")
        }

        const hashPassword = await bcrypt.hash(password, 12)
        const activationToken = nanoid(24)
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            activationToken
        })
        //@ts-ignore
        const cart = await Cart.create({ userId: user.id })
        await cart.save()

        await mailService.sendLoginMail({ to: email, activationToken })

        return NextResponse.json({
            data: {message: "Для успешной регистрации, проверьте ваш email"} 
        }, {
            status: 201
        })
    } catch (error) {
        // console.log(error)
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({
                data: { ...err }
            }, { status: status })
        }
        return NextResponse.json({ data: { message: "Произошла непредвиденная ошибка" } },
            { status: 500 })
    }
}