import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ErrorApi } from "@/app/api/services/error/errorApi";
import { tokenService } from "../../services/token/tokenService";
import { UntrackedPhones, User } from "../../DB/models/models";

export async function POST(request: NextRequest) {
    try {
        const RequestSchema = z.object({
            phoneNumber: z.string()
                .regex(/^(\+7|8)\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/, 'Невалидный номер телефона')
        })

        const data = RequestSchema.safeParse(await request.json())
        if (!data.success) throw ErrorApi.badRequest(data.error.errors[0].message)

        const { data: { phoneNumber } } = data
        const token = request.cookies.get('authorization')?.value
        const payload = tokenService.verifyAT(token)

        if (payload && typeof payload === 'object' && ("id" in payload)) {
            const candidate = await User.findByPk(payload.id)
            if (!candidate) {
                // @ts-ignore
                await UntrackedPhones.create({ phoneNumber })
            } else {
                //@ts-ignore
                candidate.phoneNumber = phoneNumber
                await candidate.save()
            }
        } else {
            // @ts-ignore
            await UntrackedPhones.create({ phoneNumber })
        }

        return NextResponse.json({
            data: {
                message: `Мы вам перезвоним по указанному номеру`
            }
        }, { status: 201 })
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: "Произошла непредвиденная ошибка" } }, { status: 520 })
    }

}