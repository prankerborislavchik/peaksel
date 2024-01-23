import { FC, ReactNode } from 'react'
import styles from './CatalogContent.module.scss'
import cn from 'classnames'
import { ProductList } from './ProductList/ProductList'

interface ICatalogContentProps {
    children?: ReactNode
    className?: string
}

export const CatalogContent: FC<ICatalogContentProps> = (props) => {

    const { className } = props

    return (
        <section className={cn(className)}>
            <h1 className={styles.heading}>Ассортимент</h1>
            <ProductList />
        </section>
    )
}