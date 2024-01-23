import { FC, ReactNode } from 'react'
import styles from './Text.module.scss'
import cn from 'classnames'

interface ITextProps {
    children?: ReactNode
    className?: string
}

export const Text: FC<ITextProps> = (props) => {

    console.warn('Компонент пока не реализован')

    const { children, className } = props

    return (
        <div className={cn(className, styles.Text)}>
            {children}
        </div>
    )
}