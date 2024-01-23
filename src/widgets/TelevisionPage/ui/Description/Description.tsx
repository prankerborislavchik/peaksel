import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import styles from '../TelevisionPage.module.scss'
import cn from 'classnames'
import { Button } from '@/shared/ui/Button'

interface IDescriptionProps {
    children?: ReactNode
    className?: string
    description?: string
}

export const Description: FC<IDescriptionProps> = (props) => {
    const { className, description } = props
    const [isOpen, setIsOpen] = useState(false)
    const [btnIsVisible, setBtnIsVisible] = useState(false)

    const textRef = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        if ((textRef.current?.scrollHeight || 0) > 294) setBtnIsVisible(true)
    }, [])


    return description ? (
        <li className={cn(className, styles.descriptionWrapper)}>
            <h3 className={styles.characteristicsTitle}>Описание</h3>
            <p className={cn(styles.description, {[styles.opened]: isOpen})} ref={textRef}>{description}</p>
            {btnIsVisible && (
                <Button onClick={() => setIsOpen(p => !p)}>{
                    isOpen ? 'Скрыть' : 'Читать полностью'
                }</Button>
            )}
        </li>
    ) : null
}