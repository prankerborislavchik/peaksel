import { NextRequest, NextResponse } from 'next/server'
import { ErrorApi } from '@/app/api/services/error/errorApi'
import { User } from '@/app/api/DB/models/models'
import { z } from 'zod'
import bcrypt from "bcrypt"

export async function GET(request: NextRequest, { params }: { params: { resetToken: string } }) {
    try {
        const { resetToken } = params
        if (resetToken === null) throw ErrorApi.badRequest("Введите корректную ссылку")

        const candidate = await User.findOne({ where: { resetToken } })
        if (!candidate) throw ErrorApi.badRequest("Данная ссылка недействительна")
        //@ts-ignore
        if (candidate.resetTokenExp < Date.now()) {
            //@ts-ignore
            candidate.resetTokenExp = null
            //@ts-ignore
            candidate.resetToken = null
            await candidate.save()
            throw ErrorApi.badRequest("Срок действия ссылки истёк")
        }

        return NextResponse.json({data: {
            message: "Данная ссылка действительна. Можете приступать к смене пароля"
        }})
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}

export async function PATCH(request: NextRequest, { params }: { params: { resetToken: string } }) {
    try {
        // Работаем чисто с токеном 
        const { resetToken } = params
        const candidate = await User.findOne({ where: { resetToken } })

        if (!resetToken || !resetToken.trim()) throw ErrorApi
            .badRequest("Ссылка для восстановления не должна быть пустой")
        
        if (!candidate) throw ErrorApi
            .badRequest(`Данная ссылка восстановления недействительна`)
        //@ts-ignore
        if (candidate.resetTokenExp < Date.now()) {
            //@ts-ignore
            candidate.resetTokenExp = null
            //@ts-ignore
            candidate.resetToken = null
            await candidate.save()
            throw ErrorApi.badRequest("Срок действия ссылки истёк")
        }
        
        // Если с токеном всё ок, начинаем работать с паролями и самим пользователем
        const ResponseSchema = z.object({
            password: z.string().trim().min(1, "Введите пароль").max(65, "Слишком длинный пароль."),
            repeatPassword: z.string().trim().min(1, "Повторите пароль").max(65, "Слишком длинный пароль.")
        })

        const data = ResponseSchema.safeParse(await request.json())
        if (!data.success) throw ErrorApi.badRequestValidation(data.error.errors)

        const { data: { password, repeatPassword } } = data
        // Не ебу зачем это нужно, но линтер ругался. Бред какой-то реально
        if ( (repeatPassword !== password) || (password !== repeatPassword) ) throw ErrorApi
            .badRequest("Пароли не совпадают")
        
        // Вот сюда попадаем если всё заебись
        //@ts-ignore
        // Новый пароль даём
        candidate.password = await bcrypt.hash(password, 12)
        // @ts-ignore
        // Сохраняем время установки пароля, чтобы потом обнулить те авторизационные куки, 
        // которые были созданы ещё со старым паролем 
        candidate.latestPasswordChangeDate = new Date()    
        // А дальше всю историю с токеном убираем
        //@ts-ignore
        candidate.resetToken = null
        //@ts-ignore
        candidate.resetTokenExp = null
        await candidate.save()

        const response = NextResponse.json({data: {message: "Пароль успешно изменён!"}}, {status: 202})
        // Почему удаляем куку? Потому что в других запросах если кука была создана до смены пароля, то мы её сбросим. 
        response.cookies.delete('authorization')
        return response
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}