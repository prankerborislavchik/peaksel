'use client'
import { FC, ReactNode, useEffect, useState } from 'react'
import styles from './Burger.module.scss'
import cn from 'classnames'
import { Button } from '@/shared/ui/Button'

interface IBurgerProps {
    children?: ReactNode
    className?: string
}

export const Burger: FC<IBurgerProps> = (props) => {
    const { children, className } = props

    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (isOpen) document.body.classList.add('modalOpened')
        else document.body.classList.remove('modalOpened')
    }, [isOpen])

    return (
        <>
            <Button
                color='clear'
                className={cn(styles.hamburger, { [styles.isActive]: isOpen })}
                onClick={() => setIsOpen(p => !p)}
            >
                <span className={cn(styles.line)}></span>
                <span className={cn(styles.line)}></span>
                <span className={cn(styles.line)}></span>
            </Button>
            <div className={cn(isOpen && styles.over)}/>
            <nav className={cn(className, styles.navBar, { [styles.opened]: isOpen })}>
                {children}
            </nav>
        </>
    )
}