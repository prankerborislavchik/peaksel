'use client'
import { FC, ReactNode, useState } from 'react'
import listStyles from './ProductList.module.scss'
import styles from './ProductListWrapper.module.scss'
import cn from 'classnames'
import { Button } from '@/shared/ui/Button'
import ListIcon from '@/shared/assets/list-icon.svg'
import TableIcon from '@/shared/assets/table-icon.svg'
import { Pagination } from '@/shared/ui/Pagination'

interface IProductListWrapperProps {
    children?: ReactNode
    className?: string
    pagesAmount?: number
    currentPage?: number
    handlePageChange(newPage: number): void
}

export const ProductListWrapper: FC<IProductListWrapperProps> = (props) => {
    const { children, className, currentPage, pagesAmount, handlePageChange } = props
    const [isCollapsed, setIsCollapsed] = useState(true)

    return (
        <>
            <div className={cn(styles.switchGridBtn)}>
                <Button
                    className={cn(styles.icon, styles.listIcon, { [styles.isActive]: !isCollapsed })}
                    onClick={() => setIsCollapsed(false)} color='clear'
                >
                    <ListIcon />
                </Button>
                <Button
                    className={cn(styles.icon, styles.tableIcon, { [styles.isActive]: isCollapsed })}
                    onClick={() => setIsCollapsed(true)} color='clear'
                >
                    <TableIcon />
                </Button>
            </div>
            <Pagination 
                currentPage={currentPage} 
                pagesAmount={pagesAmount}
                handlePageChange={handlePageChange}
            />
            <ul className={cn(className, listStyles.wrapper, { [listStyles.collapsed]: isCollapsed })}>
                {children}
            </ul>
        </>

    )
}