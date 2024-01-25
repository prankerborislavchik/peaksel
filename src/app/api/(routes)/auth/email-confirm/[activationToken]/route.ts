// import { jwt } from 'jsonwebtoken';
import { User } from "@/app/api/DB/models/models";
import { ErrorApi } from "@/app/api/services/error/errorApi";
import { tokenService } from "@/app/api/services/token/tokenService";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

interface IContext {
    params: {
        activationToken: string
    }
}

export async function POST(request: NextRequest, { params: { activationToken } }: IContext) {
    try {
        const candidate = await User.findOne({ where: { activationToken } })

        if (!candidate) {
            throw ErrorApi
                .badRequest('Пользователь с данной авторизационной ссылкой не регистрировался в Peaksel')
        }
        //@ts-ignore
        if (candidate.isActivated) {
            throw ErrorApi.badRequest("Учётная запись пользователя уже подтверждена")
        }
        //@ts-ignore
        if (candidate.activationToken === activationToken) candidate.isActivated = true
        await candidate.save()
        //@ts-ignore
        const { email, id, roles } = candidate

        const authCookie = serialize('authorization', tokenService.generateAT({ id, email, roles }), {
            httpOnly: true,
            maxAge: 24 * 24 * 60 * 60,
            secure: false, //process.env.NODE_ENV === 'production',
            sameSite: "strict",
            path: "/"
        })
        return NextResponse.json({ data: { message: "Успешная авторизация" } }, { status: 201, headers: {
            "Set-Cookie": authCookie
        } })
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: "Случилась непредвиденная ошибка" } }, { status: 520 })
    }

}