import { DetailedHTMLProps, TextareaHTMLAttributes, forwardRef } from 'react'
import styles from './Textarea.module.scss'
import cn from 'classnames'

type TTextareaProps = DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>

interface ITextareaProps extends TTextareaProps{
    className?: string
    error?: Error
} 

const Textarea = forwardRef<HTMLTextAreaElement, ITextareaProps>((props, ref) => {
    const { className, error, rows = 5, cols, ...restProps } = props

    return (
        <>
            <textarea 
                ref={ref} 
                className={cn(className, styles.textarea, error?.message && styles.error)} 
                rows={rows}
                cols={cols}
                {...restProps}
            />
            {error?.message && <div className={styles.error}>{error.message}</div>}
        </>
    )
})

export const MemoTextarea = Textarea