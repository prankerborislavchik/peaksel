import { NextRequest, NextResponse } from 'next/server'
import { ErrorApi } from '@/app/api/services/error/errorApi'
import { userMiddleware } from '../middlewares/user-middleware'
import { Cart, CartDevice, Television, User } from '@/app/api/DB/models'
import { z } from 'zod'

export async function GET(request: NextRequest) {
    try {
        // Получаем получается всю корзину
        const userData = userMiddleware(request) //{id: "ca8dc7fd-e44c-418d-96db-4a0883eb2da4"}

        const lightCart = request.nextUrl.searchParams.has('idOnly')

        const userCart = await Cart.findOne({
            where: {
                //@ts-ignore
                userId: userData.id
            },
            include: [
                {
                    model: CartDevice,
                    include: [
                        {
                            model: Television,
                            attributes: lightCart ? ['id'] : ['id', 'price', 'img', 'name', 'manufacturer']
                        }
                    ],
                    attributes: lightCart ? ['id'] : ['id', 'quantity'],
                    limit: 100
                },
            ],
            attributes: ['id', 'userId']
        })
        if (!userCart) throw ErrorApi.badRequest('У данного пользователя отсутствует корзина!')

        return NextResponse.json({ data: {cart: userCart} })
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        //@ts-ignore
        console.log(error.message)
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}
export interface ICartData {
    cart: {
        cart_devices: {
            id: string,
            quantity: number,
            television: {
                id: string
                img: string
                manufacturer: string
                name: string
                price: string
            } | null
        }[],
        id: string,
        userId: string
    }
}


export async function PATCH(request: NextRequest) {
    try {
        // Получается добавляем к корзине 
        const userData = userMiddleware(request)
        // { id: "ca8dc7fd-e44c-418d-96db-4a0883eb2da4" }

        const RequestSchema = z.object({
            televisionId: z.string().trim().min(1, 'ID телевизора обязателен к указанию'),
            newCount: z.number()
                .gte(0, 'Количество телевизоров должно быть больше 0')
                .lte(99, 'Столько наверное нет. Свяжитесь с нами для уточнения')
                .int('Количество телевизоров - целое число').nullish()
        })

        const data = RequestSchema.safeParse(await request.json())
        if (!data.success) throw ErrorApi.badRequestValidation(data.error.errors)
        const { data: { televisionId, newCount } } = data

        //@ts-ignore
        const cartCandidate = await Cart.findOne({ where: { userId: userData.id } })
        if (!cartCandidate) throw ErrorApi.badRequest('У данного пользователя отсутствует корзина!')

        const cartDeviceCandidate = await CartDevice.findOne({
            where: {
                //@ts-ignore
                cartId: cartCandidate.id, televisionId
            }
        })

        if (cartDeviceCandidate) {
            //@ts-ignore
            cartDeviceCandidate.quantity = newCount ?? cartDeviceCandidate.quantity + 1
            await cartDeviceCandidate.save()
        } else {
            //@ts-ignore
            await CartDevice.create({ cartId: cartCandidate.id, televisionId })
        }

        return NextResponse.json({ data: { message: 'Товар успешно добавлен в корзину!' } })
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        console.log(error)
        return NextResponse.json({
            data: {
                //@ts-ignore
                message: `Произошла непредвиденная ошибка: ${error.message}`
            }
        }, { status: 520 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const RequestSchema = z.object({
            cartDeviceId: z.string().trim().min(1, 'ID телевизора обязателен к указанию'),
        })

        const userData = userMiddleware(request)

        const data = RequestSchema.safeParse(await request.json())
        if (!data.success) throw ErrorApi.badRequestValidation(data.error.errors)

        const cartDeviceCandidate = await CartDevice.findByPk(data.data.cartDeviceId, {
            include: [
                {
                    model: Cart,
                    include: [
                        {
                            model: User,
                            attributes: ['id']
                        }
                    ],
                },
            ],
        })
        console.log(cartDeviceCandidate)
        if (!cartDeviceCandidate) return NextResponse
            .json({ data: { message: "Товар уже отсутствует" } })

        //@ts-ignore
        if (userData.id !== cartDeviceCandidate.cart.user.id) throw ErrorApi
            .forbidden('Данный предмет из корзины не принадлежит отправителю')

        await cartDeviceCandidate.destroy()

        return NextResponse.json({ data: { message: "Товар успешно удалён из корзины!" } })
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: 'Произошла непредвиденная ошибка' } }, { status: 520 })
    }
}