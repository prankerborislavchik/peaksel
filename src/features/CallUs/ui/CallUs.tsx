'use client'
import { FC, ReactNode, useRef, useState } from 'react'
import styles from './CallUs.module.scss'
import cn from 'classnames'
import { Button } from '@/shared/ui/Button'
import { CallUsModal } from './CallUsModal/CallUsModal'
import CallUsIcon from '@/shared/assets/call-us-icon.svg'
import { useIsLoading } from '@/shared/hooks/useIsLoading'

interface ICallUsProps {
    children?: ReactNode
    className?: string
}

export const CallUs: FC<ICallUsProps> = (props) => {
    const { className } = props
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    
    const [isLoading] = useIsLoading()

    return (
        <>
            <Button className={cn(className, styles.btn, {[styles.loading]: isLoading})} onClick={() => {
                setIsOpen(true)
                inputRef.current?.focus()
            }} 
            disabled={!!isLoading}
            >
                <span className={styles.btnText}>Заказать звонок!</span>   
                <CallUsIcon />
            </Button>   
            <CallUsModal isOpen={isOpen} handleClose={() => setIsOpen(false)} inputRef={inputRef}/>  
        </>
    )
}