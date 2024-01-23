import { FC, ReactNode } from 'react'
import styles from './BrandPanel.module.scss'
import cn from 'classnames'
import { DeleteBrandForm, SearchBrandForm as EditBrandForm} from '..'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'

interface IBrandPanelProps {
    children?: ReactNode
    className?: string
}

export const BrandPanel: FC<IBrandPanelProps> = (props) => {
    const { className } = props

    return (
        <li className={cn(className, styles.wrapper)}>
            <h2 className={styles.panelHeading}>Бренды (Производители)</h2>
            <ul className={styles.list}>
                <li>
                    <Link href='/admin/add-brand'>
                        <Button>Добавить бренд</Button>
                    </Link>
                </li>
                <EditBrandForm className={styles.form}/>
                <DeleteBrandForm className={styles.form}/>
            </ul>
        </li>
    )
}