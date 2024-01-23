import { FC, ReactNode } from 'react'
import styles from './ContactUs.module.scss'
import cn from 'classnames'

interface IContactUsProps {
    children?: ReactNode
    className?: string
}

export const ContactUs: FC<IContactUsProps> = (props) => {

    const { children, className } = props

    return (
        <div className={cn(className, styles.wrapper)}>
            <div className='container'>
                <div className={styles.formWrapper}>
                    {children}
                </div>
            </div>
        </div>
    )
}