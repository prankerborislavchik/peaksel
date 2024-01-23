import { FC, ReactNode } from 'react'
import styles from './Dashboard.module.scss'
import cn from 'classnames'
import { AdminPanel, BrandPanel, TelevisionPanel } from '@/features/Admin'

interface IDashboardProps {
    children?: ReactNode
    className?: string
}

export const Dashboard: FC<IDashboardProps> = (props) => {

    const { className } = props

    return (
        <section className={cn(className)}>
            <ul className={styles.panelWrapper}>
                <TelevisionPanel className={styles.panelItem}/>
                <BrandPanel className={styles.panelItem}/>
                <AdminPanel className={styles.panelItem}/>
            </ul>
        </section>
    )
}