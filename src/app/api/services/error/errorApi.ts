import { z } from "zod"

export class ErrorApi<E> extends Error {

    public constructor(public status: number, public message: string, public extra?: E) {
        super()
    }

    public static badRequest<T extends unknown>(message: string, extra?: T) {
        return new ErrorApi<T>(400, message, extra)
    }
    public static badRequestValidation(errors: z.ZodIssue[]) {
        // Из z.ZodIssue[] делаем объект ошибки плана { Error_Path: {messages: string[]} }
        const validationErrors = errors
            .reduce<Record<string, { messages: string[] } | undefined>>((accum, err) => {
                if (!accum[err.path[0]]) {
                    accum[err.path[0]] = { messages: [err.message] }
                } else {
                    accum[err.path[0]]?.messages.push(err.message)
                }
                return accum
            }, {})

        return new ErrorApi<typeof validationErrors>(400, "Ошибка при валидации", validationErrors)
    }
    public static unauthorized(message: string) {
        return new ErrorApi(401, message)
    }
    public static forbidden(message: string) {
        return new ErrorApi(403, message)
    }
    public static notFound(message: string) {
        return new ErrorApi(404, message)
    }
    public static iAmTeapot(message: string) {
        return new ErrorApi(418, message)
    }
    public static csrfError(message: string) {
        return new ErrorApi(419, message)
    }
    public static locked(message: string) {
        return new ErrorApi(423, message)
    }
    public static internal(message: string) {
        return new ErrorApi(500, message)
    }
    public static unknownErr(message: string) {
        return new ErrorApi(520, message)
    }
}