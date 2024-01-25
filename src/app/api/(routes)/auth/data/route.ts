import { User } from '@/app/api/DB/models/models';
import { tokenService } from '@/app/api/services/token/tokenService';
import { IUser } from '@/shared/types/User';
import { NextRequest, NextResponse } from 'next/server';
import { Model } from 'sequelize';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('authorization')?.value
        const userData: Partial<IUser> = {}

        const payload = tokenService.verifyAT(token)

        // @ts-ignore 
        // при валидном токене 
        if (payload && ("email" in payload && "id" in payload && "roles" in payload)) {
            const { email, id } = payload
            const user = await User.findOne({
                where: { email, id }
            }) as (IUser & Model<any, any>) | null
            
            const tokenCreatedAfterPasswordChange = await tokenService
                .tokenCreatedAfterLastPasswordChange(token, user?.latestPasswordChangeDate)
            if (!tokenCreatedAfterPasswordChange) {
                const response = NextResponse.json({ userData })
                response.cookies.delete('authorization')
                return response
            }

            if (user) {
                // Ну куку эту вешаем на каждый запрос, чтобы продлять ей жизнь 
                userData.email = user.email
                userData.roles = user.roles
                userData.name = user.name

                const response = NextResponse.json({ userData })
                response.cookies.set('authorization', tokenService.generateAT({
                    id: user.id, email: user.email, roles: user.roles
                }), {
                    httpOnly: true,
                    maxAge: 24 * 24 * 60 * 60,
                    secure: false, //process.env.NODE_ENV === 'production',
                    sameSite: "strict",
                    path: "/"
                })
                return response
            }
        }

        return NextResponse.json({ userData })
    } catch (error) {
        return NextResponse.json({
            //@ts-ignore
            message: error?.message || 'Произошла непредвиденная ошибка'
        }, { status: 520 }
        )
    }

}