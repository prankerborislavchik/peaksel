import jwt from 'jsonwebtoken';
import { User } from '../../DB/models/models';
import { Model } from 'sequelize';
import { Role } from '@/shared/types/Role';

interface ITokenData {
    id: string
    email: string
    roles: string[]
}
class TokenService {

    public constructor() { }

    private secretKey = process.env.SECRET_KEY || 'QiriEMDF8dW3yXx_Kv9jX'
    //AT = 'Access Token' 

    public generateAT({ id, email, roles }: ITokenData) {
        return jwt.sign({ id, email, roles }, this.secretKey, { expiresIn: '24 days' })
    }
    public verifyAT(token: string | undefined) {
        try {
            if (!token) return null
            return jwt.verify(token, this.secretKey)
        } catch (error) {
            return null
        }
    }
    public hasRole(token: string | undefined, role: Role): boolean {
        const payload = this.verifyAT(token)
        // @ts-ignore
        if (payload && ("email" in payload && "id" in payload && "roles" in payload)) {
            return payload.roles.includes(role) ? true : false
        }
        return false
    }            
    public async tokenCreatedAfterLastPasswordChange(token: string | undefined, 
        // Если была необходимость самим найти пользователя, то почему бы и не передать его latestPasswordChangeDate,
        // таким образом пользователь не ищется лишний раз
        lastPasswordChangeDate?: Date | null) {
        // Проверка, создавался ли токен до последней смены пароля или после
        // Возвращаем true - если если токен создавался до смены пароля
        // Возвращаем false во всех остальных случаях
        // Скорее всего, при возврате false просто ответ будет удалять куку authorization
        const payload = this.verifyAT(token)
        // @ts-ignore
        if (payload && ("email" in payload && "id" in payload && "roles" in payload)) {
            const { email, id, iat } = payload
            if (!lastPasswordChangeDate) {
                const user = await User.findOne({
                    where: { email, id }
                }) as ({ latestPasswordChangeDate: Date } & Model<any, any>) | null
                if (iat && user?.latestPasswordChangeDate) {
                    // Время прошло после сброса пароля
                    // От таймстампа создания токена вычитаем таймстамп даты сброса пароля
                    // Если time > 0, то значит таймстамп создания токена больше таймстампа даты сброса пароля
                    // Если <0, то токен создавался до смены пароля. 
                    // Но сбрасывать при time<0 как-то не очень, ведь iat в секундах указан, и фиг знает как оно там округлялось
                    // Так пораскинув мозгами пришёл к выводу, что пусть 
                    // максимально допустимая разница будет 15 секунд между созданием токена и обновлением пароля. 
                    // Как будто норм
                    const time = (iat * 1000 - +user.latestPasswordChangeDate) / 1000
    
                    // Если токен был инициализирован (iat) раньше смены пароля на более чем 15 секунд, то возвращаем false
                    return (time < -15) ? false : true
                }
                return false
            }
            if (iat) {
                const time = (iat * 1000 - +lastPasswordChangeDate) / 1000
                return (time < -15) ? false : true
            }
            return false
        }
        // Если токен не валидный, то возвращаем false
        return false
    }
}

export const tokenService = new TokenService()