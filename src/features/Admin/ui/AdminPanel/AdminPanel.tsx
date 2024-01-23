'use client'
import styles from './AdminPanel.module.scss'
import {FC, ReactNode} from 'react'
import cn from 'classnames'
import { AddAdminForm } from './AddAdminForm/AddAdminForm'
import { DeleteAdminForm } from './DeleteAdminForm/DeleteAdminForm'
import { useQuery } from '@tanstack/react-query'
import { IUser } from '@/shared/types/User'

interface IAdminPanelProps {
    children?: ReactNode
    className?: string
}

export const AdminPanel: FC<IAdminPanelProps> = (props) => {

    const { className } = props

    const {data} = useQuery<{userData: Pick<IUser, 'email' | 'roles' | 'name'>}>({
        queryKey: ['userData']
    })
    if (!data || !data?.userData?.roles.includes('OWNER')) return <></>

    return (
        <li className={cn(className, styles.wrapper)}>
            <h2 className={styles.heading}>Администраторы</h2>
            <ul className={styles.list}>
                <AddAdminForm />
                <DeleteAdminForm />
            </ul>
        </li>
    )
}