'use client'
import { Role } from '@/shared/types/Role'
import { DefaultLoader } from '@/shared/ui/Loaders'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FC, ReactNode, useEffect } from 'react'

interface IProtectedRouteProps {
    children?: ReactNode
    className?: string
    roles?: Role[] | Role
}

interface IUser {
    userData: {
        email?: string
        name?: string
        roles?: string[]
    }
}

export const ProtectedRoute: FC<IProtectedRouteProps> = ({children, roles = []}) => {

    roles = roles && Array.isArray(roles) ? roles : [roles]

    const router = useRouter()

    const {data, isPending} = useQuery<IUser>({
        queryKey: ['userData']
    })
    // isPending = true при отсутствии какой либо даты (до завершения первого запроса)
    
    const userRoles = data?.userData.roles || []
    // hasRoles - есть ли у пользователя все указанные роли
    const hasRoles = roles.reduce<boolean>((accum, currVal) => {
        // Изначально accum - true. Дальше проходим по всем проверяемым ролям. Если у пользователя есть роль - возвращаем тру, если у пользователя нет указанной роли - возвращаем false, и тогда accum && (проверка) всегда будет возвращать false, т.к. роли уже нет. Ролей 
        return accum && userRoles.includes(currVal) ? true : false
    }, true)
    
    useEffect(() => {
        // Нет всех указанных ролей - редирект на страницу логина
        if (!isPending && !hasRoles) router.push('/login')
    }, [hasRoles, isPending, roles, router])

    if (isPending) return <div className="container center"><DefaultLoader/></div>
    return <>{children}</>
}