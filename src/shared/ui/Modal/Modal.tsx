'use client'
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import styles from './Modal.module.scss'
import cn from 'classnames'
import { Portal } from '../Portal'

export interface IModalProps {
    isOpen?: boolean
    onClose?: () => void
    container?: Element
    lazy?: boolean
    children?: ReactNode
}

export const Modal: FC<IModalProps> = (props) => {

    let {
        children, isOpen, onClose, container, lazy
    } = props
    if (typeof window !== 'undefined') {
        container = document.body
    }

    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modalOpened')
            setIsMounted(true)
        } else {
            document.body.classList.remove('modalOpened')
        }
    }, [isOpen])

    // Для анимации закрытия
    const [isClosing, setIsClosing] = useState(false)
    const ANIMATION_DURATION = 200

    const timerRef = useRef<ReturnType<typeof setTimeout>>()

    const handleClose = useCallback(() => {
        setIsClosing(true)
        timerRef.current = setTimeout(() => {
            onClose && onClose()
            setIsClosing(false)
        }, ANIMATION_DURATION)
    }, [onClose])

    // Сворачивает окно, если пользователь нажимает Esc
    const onKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') handleClose()
    }, [handleClose])

    useEffect(() => {

        if (isOpen) {
            window.addEventListener('keydown', onKeyDown)
        }

        return () => {
            clearTimeout(timerRef.current)
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [isOpen, onKeyDown])

    if (lazy && !isMounted) return null

    return (
        <Portal container={container}>
            <div className={cn(styles.modal, {
                [styles.opened]: isOpen,
                [styles.isClosing]: isClosing
            })}
            >
                <div
                    className={cn(styles.overlay)}
                    onClick={(e) => {
                        // ** Вместо e.stopPropagation()
                        if (e.defaultPrevented) return;
                        handleClose()
                    }}
                >

                    <div
                        className={styles.content}
                        // ** Вместо e.stopPropagation()
                        onClick={(e) => e.preventDefault()}
                    >
                        {children}
                    </div>

                </div>
            </div>
        </Portal>
    )

}