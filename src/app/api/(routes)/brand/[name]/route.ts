import { NextRequest, NextResponse } from 'next/server'
import { ErrorApi } from '@/app/api/services/error/errorApi'
import { Brand } from '@/app/api/DB/models'
import { z } from 'zod'
import { adminMiddleware } from '../../middlewares'

export async function GET(request: NextRequest, { params: { name } }: { params: { name: string } }) {
    try {
        const candidate = await Brand.findOne({ where: { name } })

        const BrandNameSchema = z.string().trim()
            .min(1, 'Слишком короткое название бренда').max(27, 'Слишком длинное название бренда')
        const data = BrandNameSchema.safeParse(name)
        if (!data.success) throw ErrorApi.badRequestValidation(data.error.errors)
        if (!candidate) throw ErrorApi.badRequest('Бренд с данным названием отсутствует')

        // @ts-ignore
        const { id, logoImg, description } = candidate

        return NextResponse.json({ data: { id, logoImg, description, name } })
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}

export async function DELETE(request: NextRequest, { params: { name } }: { params: { name: string } }) {
    try {
        const response = await adminMiddleware(request)
        if (response) return response

        const candidate = await Brand.findOne({where: {name}})
        if (!candidate) throw ErrorApi.badRequest('Бренд с данным названием отсутствует')

        await candidate.destroy()

        return NextResponse.json({data: {message: "Бренд успешно удалён"}})
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}