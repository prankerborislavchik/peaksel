import { FC, ReactNode, useState } from 'react'
import styles from '../AddTelevisionForm.module.scss'
import cn from 'classnames'
import { ITelevision } from '@/shared/types/Television'
import { UseFormRegister } from 'react-hook-form'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Button } from '@/shared/ui/Button'
import { IOption, ValidationOptions } from '../../model/types'
import { TTelevision } from '../AddTelevisionForm'

interface IManyOptionsProps {
    children?: ReactNode
    className?: string
    checkboxClassName?: string
    name: keyof ITelevision
    title: string
    options: IOption[]
    register: UseFormRegister<TTelevision>
    visibleCount?: number
    validationOptions?: ValidationOptions
    error?: Error
    disabled?: boolean
}

export const ManyOptions: FC<IManyOptionsProps> = (props) => {
    let { name, options, register, title, visibleCount = 5, validationOptions = {}, error, 
        disabled, className, checkboxClassName 
    } = props
    if (visibleCount < 0) visibleCount = 5

    const [isVisible, setIsVisible] = useState(false)

    return (
        <li className={cn(styles.featuresItem, className)}>
            <h4>{title}</h4>
            <ul>
                {options.map(({ value, title }, idx) => (
                    <li key={value} className={styles.labelWrapper}>
                        <Checkbox
                            key={`${name}_${value}`}
                            {...register(name, validationOptions)}
                            value={value}
                            id={`${name}_${value}`}
                            title={title}
                            className={
                                cn(idx+1 > visibleCount && !isVisible && styles.hidden, checkboxClassName)
                            }
                            error={error}
                            disabled={disabled}
                        />
                    </li>
                ))}
            </ul>
            {options.length > visibleCount && (
                <Button onClick={() => setIsVisible(p => !p)} type='button'>
                    {isVisible ? 'Скрыть' : `Раскрыть ${options.length - visibleCount}`}
                </Button>
            )}
        </li>
    )
}