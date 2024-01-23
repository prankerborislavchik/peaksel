'use client'
import { FC, ReactNode, useEffect, useState } from 'react'
import styles from './CatalogAside.module.scss'
import cn from 'classnames'
import { Button } from '@/shared/ui/Button'
import FilterIcon from '@/shared/assets/filter-icon.svg'
import { CatalogFilter } from './CatalogFilter/CatalogFilter'
import CrossIcon from '@/shared/assets/fi-br-cross-small.svg'


interface ICatalogAsideProps {
    children?: ReactNode
    className?: string
}

export const CatalogAside: FC<ICatalogAsideProps> = (props) => {
    const { className } = props
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (isOpen) document.body.classList.add(styles.modalOpened)
        else document.body.classList.remove(styles.modalOpened)
    }, [isOpen])

    return (
        <>
            <Button className={styles.openFilterBtn} onClick={() => setIsOpen(true)}>
                <FilterIcon className={cn(styles.filterIcon)}/> Фильтры
            </Button>
            <aside className={cn(className, styles.wrapper, {[styles.opened]: isOpen})}>
                <Button 
                    onClick={() => setIsOpen(false)}
                    className={styles.closeFilterBtn}
                    size='S'
                >
                    <CrossIcon className={styles.crossIcon}/>
                </Button>   
                <CatalogFilter />      
            </aside>
        </>
    )
}