import { NextRequest, NextResponse } from 'next/server'
import { ErrorApi } from '@/app/api/services/error/errorApi'
import { z } from 'zod'
import { User } from '@/app/api/DB/models/models'
import { Model } from 'sequelize'
import { ownerMiddleware } from '../middlewares'
import { Role } from '@/shared/types/Role'
import { IUser } from '@/shared/types/User'

interface IUserData {
    roles: Role[]
    isActivated: boolean
    // ...
}

// Добавляем пользователю статус админа
export async function PATCH(request: NextRequest) {
    // Только владелец может добавлять/забирать админки
    // решил patch использовать а не пост, потому что у пользователя мы меняем роли. Не создаём что-то новое
    try {
        // response у нас !== undefined, только в случае, если у авторизационная кука была создана после последней даты смены пароля
        const response = await ownerMiddleware(request)
        if (response) return response

        const RequestSchema = z.object({
            email: z.string().trim().email('Введи валидный email')
        })
        const data = RequestSchema.safeParse(await request.json())
        if (!data.success) throw ErrorApi.badRequestValidation(data.error.errors)

        const { data: { email } } = data

        const candidate = await User.findOne({ where: { email } }) as (Model<any, any> & IUserData) | null

        if (!candidate) throw ErrorApi.badRequest("Пользователь с указанным email не зарегистрирован")
        if (!candidate.isActivated) throw ErrorApi
            .badRequest("Пользователь с указанным email не подтвердил свою учётную запись")
        if (candidate.roles.includes('ADMIN')) throw ErrorApi
            .badRequest("Данный пользователь уже обладает ролью администратора")

        candidate.roles = [...candidate.roles, 'ADMIN']
        await candidate.save()

        return NextResponse.json({
            data: {
                message: "Пользователю успешно установлен статус администратора"
            }
        })
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}

export async function DELETE(request: NextRequest) {
    // Только владелец может добавлять/забирать админки
    try {   
        const response = await ownerMiddleware(request)
        if (response) return response

        const RequestSchema = z.object({
            email: z.string().trim().min(1, 'Введи email').email('Введите валидный email')
        })
        const data = RequestSchema.safeParse(await request.json())
        if (!data.success) throw ErrorApi.badRequestValidation(data.error.errors)
        
        const candidate = await User.findOne({where: {email: data.data.email}}) as (Model & IUser) | null

        if (!candidate) throw ErrorApi.badRequest('Пользователь с указанным email не зарегистрирован')
        if (!candidate.roles.includes('ADMIN')) throw ErrorApi
            .badRequest('У данного пользователя нет статуса администратора')
        if (candidate.roles.includes('OWNER')) throw ErrorApi
            .badRequest('Данный пользователь является владельцем как бы')

        candidate.roles = candidate.roles.filter(role => role !== 'ADMIN')
        await candidate.save()

        return NextResponse.json({data: {message: "Статус админа успешно убран"}})
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}