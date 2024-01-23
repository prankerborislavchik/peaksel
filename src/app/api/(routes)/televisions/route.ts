import { NextRequest, NextResponse } from 'next/server'
import { ErrorApi } from '@/app/api/services/error/errorApi'
import { adminMiddleware } from '../middlewares'
import { z } from 'zod'
import { CartDevice, Television } from '../../DB/models'
import { Op, WhereOptions } from 'sequelize'

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

export const TelevisionDataRequestSchema = z.object({
    price: z.number().gt(0, 'Цена не может меньше 0'),
    img: z.string().trim().min(1, 'Ссылка обязательно должна быть указана'),
    name: z.string().trim()
        .min(10, 'Название не может быть меньше 10').max(500, 'Слишком длинное название'),
    diagonal: z.number()
        .gte(10, 'Диагональ телевизора не может быть меньше 10 дюймов')
        .lte(10000, 'Слишком большая диагональ'),
    hdResolution: z.enum(['4K UltraHD', '8K UltraHD', '720p HD', '1080i HD', 'Full HD']),
    manufacturer: z.string().trim().min(1, 'ID производителя обязательно для заполнения'),
    resolution: z.enum([`1280x720`, `1366x768`, `1920x1080`, `2560x1080`, `3840x2160`, `7680x4320`]),
    tvFormat: z.enum(['4:3', `16:9`, '16:10', '21:9']),
    matrix: z.enum(['IPS', 'OLED', 'VA', 'WVA', 'HVA', 'micro-LED', 'MVA',
        'S-MVA', 'S-PVA', 'PLS', 'PVA', 'SVA', 'MSA/SVA', 'TV', 'ADS', 'AMVA3',
        'A-MVA', 'ASV', 'DLED', 'FSA', 'TFT', 'TFT LED', 'U2VA', 'TN', 'QLED', 'LED']
    ).nullish(),
    screenRefreshRate: z.number()
        .gte(30, 'Слишком низкая частота обновления экрана')
        .int('Частота обновления экрана является целым числом'),
    hdmiPorts: z.number().min(1, 'Минимум 1 HDMI порт').max(6, 'Если больше 6, поставь 6 пока')
        .int('Количество HDMI портов должно быть целым числом').nullish(),
    supportSmartTv: z.boolean().nullish(),
    hdrFormat: z.array(
        z.enum(['HDR10', 'HDR10+', 'Dolby Vision', 'HLG', 'HDR 10 PRO', 'Active HDR'])
    ).nullish().default([]),
    illuminationType: z.array(
        z.enum(['Direct LED', 'Dual LED', 'Edge LED', 'mini-LED', 'RGB LED'])
    ).nullish().default([]),
    screenTechnology: z.array(z.enum(['HDR', 'LED', 'NanoCell', 'Neo QLED', 'OLED',
        'QLED', 'QNED', 'Quantum Dot', 'ULED', 'Triluminos'])).nullish().default([]),
    wirelessConnection: z.array(
        z.enum(['Airplay', "Bluetooth", 'Chromecast', 'Miracast', 'Wi-Fi', 'WiDi'])
    ).nullish().default([]),
    screenType: z.enum(['LED', 'OLED', 'ЖК', 'Лазерный', 'Плазменная панель',
        "Смарт-монитор", "ЭЛТ плоский"]).nullish(),
    tvTuner: z.array(z.enum(
        ["DVB-S2", 'DVB-S', 'DBV-C2', 'DVB-C', 'DVB-T2', 'DVB-T', 'ATV', 'без ТВ-тюнера']
    )).nullish().default([]),
    brightness: z.number()
        .gte(20, 'Слишком маленькая яркость').lte(3000, "Слишком большая яркость").nullish(),
    contrast: z.string().trim().max(15, 'Слишком большая контрастность').nullish(),
    dynamicContrast: z.string().trim().max(15, 'Слишком большая динамическая контрастность')
        .nullish(),
    viewAngle: z.number().gte(88, 'Слишком маленький угол обзора')
        .lte(180, "Слишком большой угол обзора").nullish(),
    pixelResponseTime: z.number().gte(0.01, 'Слишком маленькое время отклика пикселя')
        .lte(605, "Слишком большое время отклика пикселя").nullish(),
    dynamicSceneIdx: z.number().int('Индекс динамических сцен - целое число').nullish(),
    totalSoundPower: z.number().gte(0, 'Слишком маленькая суммарная мощность звука')
        .lte(120, "Слишком большая суммарная мощность звука").nullish(),
    dynamicsCount: z.number().gte(1, 'Слишком маленькое количество динамиков')
        .lte(16, "Слишком большое количество динамиков").int('Количество динамиков - целое число')
        .nullish(),
    vesaFixingStandard: z.string().trim().max(20, 'Слишком длинный стандарт крепления vesa')
        .nullish(),
    hdmiVersion: z.enum(['HDMI 1.3', 'HDMI 1.4', 'HDMI 2.0', 'HDMI 2.1']).nullish(),
    usbAmount: z.number().gte(0, 'Не может быть отрицательное количество портов USB')
        .lte(5, "Слишком большое количество портов USB")
        .int('Количество портов USB - целое число').nullish(),
    wifiStandard: z.enum(['802.11b (Wi-Fi 1)', '802.11a (Wi-Fi 2)', '802.11g (Wi-Fi 3)',
        '802.11n (Wi-Fi 4)', '802.11ac (Wi-Fi 5)', '802.11ax (Wi-Fi 6)']
    ).nullish(),
    power: z.number().gte(0, 'Слишком маленькая потребляемая мощность')
        .lte(1125, "Слишком большая потребляемая мощность").nullish(),
    width: z.number().gte(150, 'Слишком маленькая ширина')
        .lte(3000, "Слишком большая ширина").nullish(),
    height: z.number().gte(150, 'Слишком маленькая высота')
        .lte(3000, "Слишком большая высота").nullish(),
    depth: z.number().gte(20, 'Слишком маленькая глубина')
        .lte(1300, "Слишком большая глубина").nullish(),
    weight: z.number().gte(1, 'Слишком маленький вес телевизора')
        .lte(230, "Слишком больший вес телевизора").nullish(),
    creationYear: z.number().gte(2007, 'Слишком рано')
        .lte((new Date()).getFullYear(), "Не верю в машину времени")
        .int('Год создания телевизора - целое число').nullish(),
    hasBlackoutTechnology: z.boolean().nullish(),
    blackoutZonesAmount: z.number().gte(30, 'Слишком маленькое количество зон затемнения')
        .lte(6000, 'Слишком большое количество зон затемнения')
        .int("Количество зон затемнения - целое число").nullish(),
    description: z.string().max(5000, 'Слишком длинное описание телевизора').nullish()
})

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