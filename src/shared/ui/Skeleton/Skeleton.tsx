import { FC, ReactNode } from 'react'
import styles from './Skeleton.module.scss'
import cn from 'classnames'

interface ISkeletonProps {
    children?: ReactNode
    className?: string
}

export const Skeleton: FC<ISkeletonProps> = (props) => {
    const { className } = props

    return (
        <div className={cn(className, styles.skeleton)}></div>
    )
}