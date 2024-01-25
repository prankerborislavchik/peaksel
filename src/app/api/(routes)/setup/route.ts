import { NextRequest, NextResponse } from 'next/server'
import { ErrorApi } from '@/app/api/services/error/errorApi'
import {
//  User, Cart, CartDevice, Television, Brand,
//  Rating, UntrackedPhones, ContactRequests,
//  Order, OrderDevice
} from '../../DB/models'
import { sequelize } from '../../DB/db'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        if ((data.setupKey === process.env.SETUP_KEY) && !!process.env.SETUP_KEY) {
            await sequelize.authenticate()
            await sequelize.sync()
        }
        // console.log(request.nextUrl.searchParams.has('idOnly'))
        // await Order.sync({force: true})
        // await OrderDevice.sync({force: true})
        // await CartDevice.sync({force: true})

        return NextResponse.json({ data: { message: 'zaebca' + randomUUID()} })
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