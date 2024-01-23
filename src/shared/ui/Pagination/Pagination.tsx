'use client'
import { ReactNode, memo } from 'react'
import styles from './Pagination.module.scss'
import cn from 'classnames'
import { Button } from '../Button'

interface IPaginationProps {
    children?: ReactNode
    className?: string
    pagesAmount?: number
    currentPage?: number
    // pageSize?: number
    handlePageChange(newPageNumber: number): void
}

export const Pagination = memo((props: IPaginationProps) => {
    const {
        className,
        pagesAmount = 1,
        currentPage = 1,
        handlePageChange
    } = props
    const max = 11
    const pages: ReactNode[] = []

    const PageBtn = memo(({ pageNumber }: { pageNumber: number }) => (
        <Button
            color={currentPage === pageNumber && 'primary' || 'secondary'}
            nonStyledDisabled={currentPage === pageNumber}
            onClick={() => handlePageChange(pageNumber)}
        >
            {pageNumber}
        </Button>))

    if (pagesAmount <= 1) return <div className={styles.empty}/> 

    if (pagesAmount <= max) {
        for (let page = 1; page <= pagesAmount; page++) pages.push(<PageBtn pageNumber={page} key={page}/>)
    } else {
        const pageFrom = currentPage < max - 5
            ? 2 // Если текущая страница недалеко от начала
            : currentPage > pagesAmount - 5
                ? pagesAmount - 6 // Если текущая страница недалеко от конца
                : currentPage - 2 // Если текущая страница где-то между
        const to = currentPage < max - 5
            ? max - 4 // Если текущая страница недалеко от начала
            : currentPage > pagesAmount - 5
                ? pagesAmount - 1 // Если текущая страница недалеко от конца
                : currentPage + 2 // Если текущая страница где-то между

        for (let page = pageFrom; page <= to; page++) pages.push(<PageBtn pageNumber={page} key={page}/>)
    }
    const smallPagesAmount = pagesAmount <= max

    return (
        <div className={cn(className, styles.wrapper)}>
            {smallPagesAmount || (<>
                <Button
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(
                        currentPage < max - 5 
                            ? currentPage - 1 // Если около начала
                            : currentPage - 5 
                    )}
                >
                    &lt;
                </Button>
                <PageBtn pageNumber={1} />
                {currentPage < max - 5 || <p>...</p>}
            </>)}
            {pages}
            {smallPagesAmount || (<>
                {currentPage > pagesAmount - 5 || <p>...</p>}
                <PageBtn pageNumber={pagesAmount} />
                <Button
                    disabled={currentPage >= pagesAmount}
                    onClick={() =>
                        handlePageChange(
                            currentPage > pagesAmount - 5
                                ? currentPage + 1 // Если страница около конца 
                                : currentPage + 5 
                        )
                    }
                >
                    &gt;
                </Button>
            </>)}
        </div>
    )
})