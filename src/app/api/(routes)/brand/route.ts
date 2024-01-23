import { NextRequest, NextResponse } from 'next/server'
import { ErrorApi } from '@/app/api/services/error/errorApi'
import { Brand } from '@/app/api/DB/models'
import { z } from 'zod'
import { adminMiddleware } from '../middlewares'
import { Model } from 'sequelize'
import { IBrand } from '@/shared/types/Brand'

export async function POST(request: NextRequest) {
    // Создание нового бренда. Ток админу доступно естественно
    try {
        const response = await adminMiddleware(request)
        if (response) return response

        const RequestSchema = z.object({
            name: z.string().trim().min(1, 'Ну введи название бренда')
                .max(27, 'Слишком длинное название бренда'),
            logoImg: z.string().trim().min(1, 'Введи ссылку на лого бренда'),
            description: z.string().trim().optional()
        })

        const data = RequestSchema.safeParse(await request.json())

        if (!data.success) throw ErrorApi.badRequestValidation(data.error.errors)

        const { data: { name, logoImg, description = '' } } = data

        const candidate = await Brand.findOne({ where: { name } })

        if (candidate) throw ErrorApi.badRequest('Данный бренд уже добавлен')

        await Brand.create({ name, logoImg, description })

        return NextResponse.json({ data: { message: 'Бренд успешно добавлен' } }, { status: 201 })
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}

export async function PUT(request: NextRequest) {
    // Обновление чего-либо у бренда 
    try {
        const response = await adminMiddleware(request)
        if (response) return response

        const RequestSchema = z.object({
            name: z.string().trim()
                .min(1, "Слишком короткое название бренда").max(27, "Слишкое длинное название бренда"),
            logoImg: z.string().trim().min(1, 'Введи ссылку на лого бренда'),
            description: z.string().trim().optional(),
            id: z.string().trim().min(1, "Ну id обязательно должен быть")
        })

        const data = RequestSchema.safeParse(await request.json())

        if (!data.success) throw ErrorApi.badRequestValidation(data.error.errors)
        const { data: { id, logoImg, name, description = '' } } = data

        // @ts-ignore
        let candidate = await Brand.findByPk(id) as (Model<any, any> & IBrand) | null

        if (!candidate) throw ErrorApi.badRequest('Бренд с данным id не найден')

        candidate.logoImg = logoImg
        candidate.name = name
        candidate.description = description
        await candidate.save()

        return NextResponse.json({ data: { message: 'Информация успешно обновлена!' } })
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const brands = await Brand.findAll({ attributes: ['name', 'id'] })

        return NextResponse.json({ brands })
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}