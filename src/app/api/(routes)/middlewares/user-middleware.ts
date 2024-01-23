import { NextRequest } from "next/server"
import { ErrorApi } from "../../services/error/errorApi"
import { tokenService } from "../../services/token/tokenService"

export function userMiddleware(request: NextRequest) {
    // Ну пользователю - не админ, можно и не перегружать каждый запрос как на админа/владельца
    const token = request.cookies.get('authorization')?.value
    const userData = tokenService.verifyAT(token)
    if (!userData) throw ErrorApi.unauthorized("Пользователь не авторизован")
    if (!tokenService.hasRole(token, 'USER')) throw ErrorApi
        .forbidden('Данная функция доступна только авторизованному пользователю')
    return userData
}