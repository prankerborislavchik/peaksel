'use client'
import { DetailedHTMLProps, InputHTMLAttributes, forwardRef, memo } from 'react'
import styles from './Input.module.scss'
import cn from 'classnames'
import { Size } from '@/shared/types/Size'

interface IInputProps
    extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    className?: string
    inputSize?: Size
    error?: Error
    errorClassName?: string
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
    (props, forwardRef) => {

        let {
            className,
            inputSize = 'M',
            error,
            errorClassName,
            ...restProps
        } = props

        return (
            <>
                <input
                    className={cn(
                        className, styles.Input, styles[inputSize], error?.message && styles.error
                    )}
                    ref={forwardRef}
                    {...restProps} />
                {error?.message && 
                    <span className={cn(styles.errorMsg, errorClassName)}>{error.message}</span>
                }
            </>
        )
    })

export const MemoInput = memo(Input)