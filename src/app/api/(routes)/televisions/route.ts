import { NextRequest, NextResponse } from 'next/server'
import { ErrorApi } from '@/app/api/services/error/errorApi'
import { adminMiddleware } from '../middlewares'
import { z } from 'zod'
import { CartDevice, Television } from '../../DB/models'
import { Op, WhereOptions } from 'sequelize'
import { TelevisionDataRequestSchema } from './televisionDataRequestSchema'

export async function GET(request: NextRequest) {
    try {
        const tvSearch: WhereOptions = {
            price: {
                [Op.gte]: +(request.nextUrl.searchParams.get('price_from') || 0),
            },
            diagonal: {
                [Op.gte]: +(request.nextUrl.searchParams.get('diagonal_from') || 0),
            }
        }
        const name = request.nextUrl.searchParams.get('name')
        if (name) tvSearch.name = name

        const priceCeil = request.nextUrl.searchParams.get('price_to')
        if (priceCeil) tvSearch.price[Op.lte] = +priceCeil
        const diagonalCeil = request.nextUrl.searchParams.get('diagonal_to')
        if (diagonalCeil) tvSearch.diagonal[Op.lte] = +diagonalCeil
        // ENUMS
        const hdResolution = request.nextUrl.searchParams.getAll('hdResolution')
        if (hdResolution.length) tvSearch.hdResolution = {[Op.or]: hdResolution}
        const manufacturer = request.nextUrl.searchParams.getAll('brand')
        if (manufacturer.length) tvSearch.manufacturer = {[Op.or]: manufacturer}
        const screenRefreshRate = request.nextUrl.searchParams.getAll('screenRefreshRate')
        if (screenRefreshRate.length) tvSearch.screenRefreshRate = {[Op.or]: screenRefreshRate}
        const resolution = request.nextUrl.searchParams.getAll('resolution')
        if (resolution.length) tvSearch.resolution = {[Op.or]: resolution}
        const screenType = request.nextUrl.searchParams.getAll('screenType')
        if (screenType.length) tvSearch.screenType = {[Op.or]: screenType}
        const hdmiPorts = request.nextUrl.searchParams.getAll('hdmiPorts')
        if (hdmiPorts.length) tvSearch.hdmiPorts = {[Op.or]: hdmiPorts}
        // ARRAYS
        const screenTechnology = request.nextUrl.searchParams.getAll('screenTechnology')
        if (screenTechnology.length) tvSearch.screenTechnology = {[Op.contains]: screenTechnology}
        const illuminationType = request.nextUrl.searchParams.getAll('illuminationType')
        if (illuminationType.length) tvSearch.illuminationType = {[Op.contains]: illuminationType}
        // PAGINATION
        const defaultPageSize = 20
        const maxPageSize = 100
  
        const pageSizeQ = +(request.nextUrl.searchParams.get('pageSize') || defaultPageSize)
        // минимальная валидация для размера страницы
        const pageSize = pageSizeQ > maxPageSize ? maxPageSize : pageSizeQ < 0 ? defaultPageSize : pageSizeQ
        const page = +(request.nextUrl.searchParams.get('page') || 1)
        const offset = (page - 1) * pageSize

        const {count: totalCount, rows: televisions} = await Television.findAndCountAll({
            where: tvSearch,
            attributes: ['id', 'price', 'img', 'name'],
            offset,
            limit: pageSize
        })
        
        return NextResponse.json({ data: { televisions, totalCount, offset, pageSize, page } })
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        console.log(error)
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const res = await adminMiddleware(request)
        if (res) return res
      
        const tvData = await request.json()
        const { supportSmartTv, hasBlackoutTechnology, screenRefreshRate } = tvData
        
        tvData.supportSmartTv = supportSmartTv === 'true' ?
            true : supportSmartTv === 'false' ? false : null
        tvData.hasBlackoutTechnology = hasBlackoutTechnology === 'true' ?
            true : hasBlackoutTechnology === 'false' ? false : null
        tvData.screenRefreshRate = parseInt(screenRefreshRate)
        
        const data = TelevisionDataRequestSchema.safeParse(tvData)
        if (!data.success) throw ErrorApi.badRequestValidation(data.error.errors)

        await Television.create({ ...data.data })
        return NextResponse.json({ data: { message: "Телевизор успешно создан" } })
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            console.log(error.extra)
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ 
            //@ts-ignore
            data: { message: `Произошла непредвиденная ошибка: ${error.message}` } }, { status: 520 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const response = await adminMiddleware(request)
        if (response) return response

        const RequestSchema = z.object({
            televisionName: z.string().trim().max(500, 'Слишком длинное название у телевизора')
        })

        const data = RequestSchema.safeParse(await request.json())

        if (!data.success) throw ErrorApi.badRequestValidation(data.error.errors) 

        const candidate = await Television.findOne({where: {name: data.data.televisionName}})
        if (!candidate) return NextResponse.json({data: {message: 'Телевизор уже отсутствует'}})

        // удаляем все телевизоры из корзин
        await CartDevice.destroy({
            where: {
                //@ts-ignore
                televisionId: candidate.id
            }
        })
        await candidate.destroy()

        return NextResponse.json({data: {message: "Телевизор успешно удалён из бд"}})
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}