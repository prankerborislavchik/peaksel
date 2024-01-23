import { DetailedHTMLProps, InputHTMLAttributes, ReactNode, forwardRef, memo } from 'react'
import styles from './Checkbox.module.scss'
import cn from 'classnames'

type TCheckbox = Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'type'>

interface ICheckboxProps extends TCheckbox {
    children?: ReactNode
    title?: string
    className?: string
    error?: Error
}

const Checkbox = forwardRef<HTMLInputElement, ICheckboxProps>((props, ref) => {
    const { children, title, className, id, value, name, error, ...restProps } = props

    return (
        <>
            <input 
                type='checkbox' 
                className={cn(styles.checkbox, error?.message && styles.error)}
                id={id}
                value={value}
                name={name}
                ref={ref}
                {...restProps}
            />
            <label htmlFor={id} className={cn(className)}>
                {children || title}
            </label>
            {/* {error?.message && <span className={styles.errorMsg}>{error.message}</span>} */}
        </>
    )
})

export const MemoCheckbox = memo(Checkbox)