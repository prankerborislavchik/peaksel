import { FC, ReactNode } from 'react'
import styles from './Catalog.module.scss'
import cn from 'classnames'
import { CatalogAside } from '../CatalogAside/CatalogAside'
import { CatalogContent } from '../CatalogContent/CatalogContent'

interface ICatalogProps {
    children?: ReactNode
    className?: string
}

export const Catalog: FC<ICatalogProps> = (props) => {

    const { className } = props

    return (
        <div className={cn(className, styles.wrapper)}>
            <CatalogAside className={cn(styles.aside)}/>
            <CatalogContent className={styles.content}/>
        </div>
    )
}