import { ReactNode } from 'react'
import styles from './Admin.module.scss'
import cn from 'classnames'
import { Button } from '@/shared/ui/Button'
import adminPanelIcon from '@/shared/assets/admin-panel-icon.png'
import Image from 'next/image'
import Link from 'next/link'

interface IAdminProps {
    children?: ReactNode
    className?: string
    isAdmin: boolean
}

export function Admin(props: IAdminProps) {
    const { className, isAdmin } = props

    if (!isAdmin) return <></>

    return (
        <Link href={'/admin'}>
            <Button className={cn(className)} size='S'>
                <span className={styles.text}>Панель администратора</span>
                <Image src={adminPanelIcon} alt='Панель админа' className={styles.img} width={32} />
            </Button>
        </Link>
    )
}