import { NextRequest, NextResponse } from "next/server"
import { ErrorApi } from "../../services/error/errorApi"
import { tokenService } from "../../services/token/tokenService"

export async function adminMiddleware(request: NextRequest) {
    // Короче, на ЛЮБОЙ запрос на админа, будет проверяться:
    // Наличие самой роли у пользователя (Чисто в токене впринципе норм)
    // Токен был получен до/после последней смены пароля (Токен хоть и обновляется при каждом заходе. Ну мало ли взломал аккаунт и не выходил с сайта, а пароль поменяли) 
    // И всё наверное

    const token = request.cookies.get('authorization')?.value
    if (!tokenService.verifyAT(token)) throw ErrorApi.unauthorized("Пользователь не авторизован")
    if (!tokenService.hasRole(token, 'ADMIN')) throw ErrorApi
        .forbidden('Данная функция доступна только администратору')
    
    const tokenCreatedAfterPasswordChange = await tokenService.tokenCreatedAfterLastPasswordChange(token)
    if (!tokenCreatedAfterPasswordChange) {
        const response = NextResponse.json({
            data: {
                message: "Пароль учётной записи был изменён после авторизации. Попробуйте перезайти"
            }
        }, { status: 403 })
        response.cookies.delete('authorization')
        return response
    }

}