import { NextRequest, NextResponse } from 'next/server'
import { ErrorApi } from '@/app/api/services/error/errorApi'
import { z } from 'zod'
import { userMiddleware } from '../middlewares'
import { Order, OrderDevice } from '../../DB/models'

export async function POST(request: NextRequest) {
    try {
        const userData = userMiddleware(request)

        if (typeof userData === 'string' || !userData.id) throw ErrorApi
            .unauthorized('Пользователь не авторизован')

        const RequestSchema = z.object({
            orderDevices: z.array(z.object({
                quantity: z.number().gte(1, 'Количество телевизоров не может быть меньше 1')
                    .int('Количество телевизоров - целое число'),
                televisionId: z.string().trim().min(1, 'Данное поле обязательно для заполнения')
            })),
            orderPlacementSum: z.number().gte(0, 'Сумма заказа не может быть меньше 0')
        })

        const data = RequestSchema.safeParse(await request.json())
        if (!data.success) throw ErrorApi.badRequestValidation(data.error.errors)

        const {orderPlacementSum, orderDevices} = data.data
        
        const orderData = {userId: userData.id, orderPlacementSum}
        
        const [order, created] = await Order.findOrCreate({where: orderData, defaults: orderData})
        if (created) orderDevices.forEach(async ({quantity, televisionId}) => {
            //@ts-ignore
            await OrderDevice.create({quantity, televisionId, orderId: order.id})
        })

        throw ErrorApi.iAmTeapot('Произошла ошибка при формировании заказа. Попробуйте позже')

        // return NextResponse.json({data: {}})
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}