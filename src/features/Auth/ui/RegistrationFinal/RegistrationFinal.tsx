'use client'
import { FC, ReactNode } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DefaultLoader } from '@/shared/ui/Loaders'

interface IRegistrationFinalProps {
    children?: ReactNode
    className?: string
    activationToken?: string
}

export const RegistrationFinal: FC<IRegistrationFinalProps> = (props) => {

    const { className, activationToken } = props

    const queryClient = useQueryClient()

    const { data, isPending, error, isError} = useQuery({
        queryKey: [activationToken],
        queryFn: async () => {
            const res = await fetch(`/api/auth/email-confirm/${activationToken}`, {
                cache: "no-cache", credentials: "include", method: "POST"
            })
            const {data: {message}} = await res.json()
            if (res.ok) {
                queryClient.invalidateQueries({ queryKey: ['userData'] })
                return message
            }
            throw new Error(message)
        },
        retry: false
    })

    if (isPending) {
        return <div className="container center"><DefaultLoader /></div>
    }
    if (isError) return (
        <div className="container center">
            <h3>{error?.message}</h3>
        </div>
    )

    if (data) {
        return (
            <div className="container center">
                <div className={cn(className)}>
                    <h1>Учётная запись успешно подтверждена!</h1>
                    <p>Желаем вам удачных покупок!</p> <br />
                    <Link href={'/'}>Перейти к ассортименту</Link>
                </div>
            </div>
        )
    }

    return <></>
}