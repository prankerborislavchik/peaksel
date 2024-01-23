import { NextRequest, NextResponse } from "next/server";
import { ContactRequests } from "../../DB/models/models";
import { ErrorApi } from "../../services/error/errorApi";
import { z } from "zod";

export async function POST(request: NextRequest) {
    try {
        const ResponseSchema = z.object({
            sender: z.string().trim().min(1, "Отправитель не может быть пустой строкой")
                .max(120, "Слишком длинный контакт"),
            message: z.string().trim().min(1, "Ну напиши письмо")
                .max(1500, "Ну не настолько же длинное письмо, попробуй уложиться в 1500 символов")
        })        

        const data = ResponseSchema.safeParse(await request.json())

        if (!data.success) {
            throw ErrorApi.badRequestValidation(data.error.errors)
        }
        const {data: {sender, message}} = data
        await ContactRequests.create({sender, message})

        return NextResponse.json({data: {message: "Мы приняли ваше обращение!"}}, {status: 201})
    } catch (error) {
        if (error instanceof ErrorApi) {
            const { status, ...err } = error
            return NextResponse.json({ data: { ...err } }, { status })
        }
        return NextResponse.json({ data: { message: "Произошла непредвиденная ошибка" } }, { status: 520 })
    }
}
