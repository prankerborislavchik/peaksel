import { NextRequest, NextResponse } from 'next/server'
import { ErrorApi } from '@/app/api/services/error/errorApi'
import mailService from '@/app/api/services/email/MailService'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { User } from '@/app/api/DB/models/models'

export async function PATCH(request: NextRequest) {
    try {
        const RequestSchema = z.object({
            email: z.string().trim().min(1, "email не может быть пустым").email("Введите валидный email")
                .max(254, "Слишком длинный email получился. Попробуй уложиться в 250 символов")
        })

        const data = RequestSchema.safeParse(await request.json())
        
        if (!data.success) throw ErrorApi.badRequestValidation(data.error.errors) 
        const {data: {email}} = data
        
        const candidate = await User.findOne({where: {email}})
        if (!candidate) throw ErrorApi.badRequest("Данный пользователь не зарегистрирован в Пиксель")
        
        //@ts-ignore
        if (candidate.resetTokenExp > Date.now()) {
            // Токен уже есть, пусть по нему и авторизуется
            //@ts-ignore
            await mailService.sendRecoverPasswordMail({to: email, resetToken: candidate.resetToken})  
        } else {
            //Токена ещё нет. Создаём и отправляем
            const resetToken = nanoid(24)
            await mailService.sendRecoverPasswordMail({to: email, resetToken}) 
            // @ts-ignore
            candidate.resetToken = resetToken
            // @ts-ignore
            candidate.resetTokenExp = new Date(Date.now() + 2 * 60 * 60 * 1000)
            await candidate.save()
        }

        return NextResponse.json({data: {
            message: "Мы отправили на вашу почту письмо для восстановления пароля"
        }}, {status: 201})
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}