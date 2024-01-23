import { FC, ReactNode } from 'react'
import styles from './Default.module.scss'
import cn from 'classnames'

interface IDefaultProps {
    children?: ReactNode
    className?: string
}

export const DefaultLoader: FC<IDefaultProps> = (props) => {

    const { className } = props

    return (
        <span className={cn(styles.loader, className)}></span>
    )
}