import { ButtonHTMLAttributes, DetailedHTMLProps, FC, ReactNode, memo } from 'react'
import styles from './Button.module.scss'
import cn from 'classnames'
import { Size } from '../../types/Size'
import { Color } from '../../types/Color'
import { Fullness } from '@/shared/types/Fullness'

interface IButtonProps
    extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    children?: ReactNode | string
    size?: Size
    color?: Color | "clear" | "default"
    fullness?: Fullness
    loading?: boolean
    nonStyledDisabled?: boolean
}

export const Button: FC<IButtonProps> = (props) => {

    const {
        children,
        className,
        size = 'M',
        color = 'secondary',
        fullness = "filled",
        disabled,
        loading = false,
        nonStyledDisabled = false,
        ...restProps 
    } = props

    return (
        <button
            className={
                cn(
                    className, styles.btn, styles[size], styles[color], styles[fullness],
                    { [styles.disabled]: disabled, [styles.loading]: loading })
            }
            disabled={!!disabled || nonStyledDisabled}
            {...restProps}
        >
            {children}
        </button>
    )
}

export const MemoButton = memo(Button)