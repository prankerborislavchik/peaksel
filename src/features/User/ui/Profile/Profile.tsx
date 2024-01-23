'use client'
import { FC, ReactNode } from 'react'
import styles from './Profile.module.scss'
import cn from 'classnames'
import Link from 'next/link'
import { Cart } from '../Cart/Cart';
import { Admin } from '../Admin/Admin'
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher'
import { useQuery } from '@tanstack/react-query'
import UserIcon from '@/shared/assets/user-icon.svg'
import { Button } from '@/shared/ui/Button'
import { Skeleton } from '@/shared/ui/Skeleton'

interface IProfileProps {
    children?: ReactNode
    className?: string
}

interface IUser {
    userData: {
        email?: string
        name?: string
        roles?: string[]
    }
}

const User: FC<{ userName?: string; email?: string }> = (props) => {
    const { userName, email } = props

    return (
        <>
            {
                userName && email ? (
                    <div className={styles.wrapper}>
                        <Button color='clear' className={styles.userBtn}>
                            <UserIcon />
                        </Button>
                    </div >
                ) : (
                    <Link href={'/login'} className={styles.link}>Войти</Link>
                )}
        </>
    )
}

export const Profile: FC<IProfileProps> = (props) => {
    const { className } = props

    const { data, isFetching, isLoading, } = useQuery<IUser>({
        queryKey: ['userData'],
        queryFn: () => fetch(`/api/auth/data`).then(res => res.json()),
    })
    if (isLoading || isFetching) return <div className={styles.wrapper}>
        <Skeleton className={styles.skeleton}/></div>

    return (
        <div className={cn(className, styles.wrapper)}>
            <Admin isAdmin={!!data?.userData.roles?.includes("ADMIN")} />
            <ThemeSwitcher />
            <Cart />
            <User userName={data?.userData.name} email={data?.userData.email} />
        </div>
    )
}