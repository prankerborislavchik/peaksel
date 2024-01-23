import { NextRequest, NextResponse } from 'next/server'
import { ErrorApi } from '@/app/api/services/error/errorApi'
import {
    User, Cart, CartDevice, Television, Brand,
    Rating, UntrackedPhones, ContactRequests,
    Order, OrderDevice
} from '../../DB/models'
import { sequelize } from '../../DB/db'
import { randomUUID } from 'crypto'

export async function GET(request: NextRequest) {
    try {
        console.log(randomUUID())
        // console.log(request.nextUrl.searchParams.has('idOnly'))
        // await sequelize.sync()
        // await Order.sync({force: true})
        // await OrderDevice.sync({force: true})
        // await CartDevice.sync({force: true})

        return NextResponse.json({ data: { message: 'zaebca' } })
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        console.log(error)
        return NextResponse.json({ data: { message: 
            //@ts-ignore
            `Произошла непредвиденная ошибка ${error.message}` } }, { status: 520 })
    }
}