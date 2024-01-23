import { FC, ReactNode, useState } from 'react'
import styles from '../AddTelevisionForm.module.scss'
import cn from 'classnames'
import { IOption, ValidationOptions } from '../../model/types'
import { Button } from '@/shared/ui/Button'
import { UseFormRegister } from 'react-hook-form'
import { ITelevision } from '@/shared/types/Television'
import { InputRadio } from '@/shared/ui/InputRadio'
import { TTelevision } from '../AddTelevisionForm'

interface IOneOfManyOptionsProps {
    children?: ReactNode
    className?: string
    radioClassName?: string
    name: keyof ITelevision
    title: string
    options: IOption[]
    register: UseFormRegister<TTelevision>
    visibleCount?: number
    validationOptions?: ValidationOptions
    error?: Error
    disabled?: boolean
}

export const OneOfManyOptions: FC<IOneOfManyOptionsProps> = (props) => {

    let { name, options, title, register, visibleCount = 5, validationOptions = {}, error, 
        disabled, className, radioClassName
    } = props
    if (visibleCount < 0) visibleCount = 5
    const [isVisible, setIsVisible] = useState(false)

    return (
        <li className={cn(styles.featuresItem, className)}>
            <h4>{title}</h4>
            <ul>
                {options.map(({ value, title }, idx) => (
                    <li key={value} className={styles.labelWrapper}>
                        {<InputRadio
                            {...register(name, validationOptions)}
                            value={value}
                            id={`${name}_${value}`}
                            title={title}
                            className={
                                cn((idx + 1 > visibleCount && !isVisible) && styles.hidden, radioClassName)
                            }
                            error={error}
                            disabled={disabled}
                        />}
                    </li>
                ))}
                {error?.message && <div className={styles.error}>{error.message}</div>}
            </ul>
            {options.length > visibleCount && <Button
                type='button' onClick={() => setIsVisible(p => !p)}>
                {isVisible ? "Скрыть" : `Раскрыть +${options.length - visibleCount}`}</Button>}
        </li>
    )
}