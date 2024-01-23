import { FC, ReactNode } from 'react'
import styles from './TelevisionPanel.module.scss'
import cn from 'classnames'
import Link from 'next/link'
import { Button } from '@/shared/ui/Button'
import { EditTelevisionForm } from '../EditTelevisionForm/EditTelevisionForm'
import { DeleteTelevisionForm } from '../DeleteTelevisionForm/DeleteTelevisionForm'

interface ITelevisionPanelProps {
    children?: ReactNode
    className?: string
}

export const TelevisionPanel: FC<ITelevisionPanelProps> = (props) => {
    const { className } = props

    return (
        <li className={cn(className)}>
            <h2 className={styles.panelHeading}>Телевизоры</h2>
            <ul className={styles.list}>
                <li>
                    <Link href={'/admin/add-tv'}>
                        <Button>Добавить телевизор</Button>                   
                    </Link>
                </li>
                <EditTelevisionForm />
                <DeleteTelevisionForm />
            </ul>
        </li>
    )
}