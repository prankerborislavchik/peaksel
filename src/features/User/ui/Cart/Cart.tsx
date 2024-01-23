import { FC, ReactNode } from 'react'
import styles from './Cart.module.scss'
import cn from 'classnames'
import CartIcon from '@/shared/assets/cart-icon.svg'
import Link from 'next/link'


interface ICartProps {
    children?: ReactNode
    className?: string
}

export const Cart: FC<ICartProps> = (props) => {
    const { className } = props

    return (
        <div className={cn(className, styles.wrapper)}>
            <Link href={`/cart`}>
                <div className={styles.notification}></div>
                <CartIcon className={styles.cartIcon}/>
            </Link>
        </div>
    )
}