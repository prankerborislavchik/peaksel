import { NextRequest, NextResponse } from 'next/server'
import { ErrorApi } from '@/app/api/services/error/errorApi'
import { Brand, Television } from '@/app/api/DB/models'
import { TelevisionDataRequestSchema } from '../televisionDataRequestSchema'
import { adminMiddleware } from '../../middlewares'

export async function GET(request: NextRequest, {params: {id}}: {params: {id: string}}) {
    try {
        const tvCandidate = await Television.findByPk(id, {
            include: [{
                model: Brand,
                attributes: ['id', 'logoImg', 'name']
            }],
        })
        if (!tvCandidate) throw ErrorApi.badRequest('Данный телевизор отсутствует') 
        
        return NextResponse.json({data: {television: tvCandidate}})
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}

export async function PUT(request: NextRequest, {params: {id}}: {params: {id: string}}) {
    try {
        const res = await adminMiddleware(request)
        if (res) return res

        const tvCandidate = await Television.findByPk(id)
        if (!tvCandidate) throw ErrorApi.badRequest('Данный телевизор отсутствует') 

        const tvData = await request.json()
        const { supportSmartTv, hasBlackoutTechnology, screenRefreshRate } = tvData
        
        tvData.supportSmartTv = supportSmartTv === 'true' ?
            true : supportSmartTv === 'false' ? false : null
        tvData.hasBlackoutTechnology = hasBlackoutTechnology === 'true' ?
            true : hasBlackoutTechnology === 'false' ? false : null
        tvData.screenRefreshRate = parseInt(screenRefreshRate)
        
        const data = TelevisionDataRequestSchema.safeParse(tvData)
        if (!data.success) throw ErrorApi.badRequestValidation(data.error.errors)
        //@ts-ignore
        Object.entries(data.data).forEach(([key, value]) => tvCandidate[key] = value)
        
        await tvCandidate.save()

        return NextResponse.json({data: {message: "Телевизор успешно обновлён"}})
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}