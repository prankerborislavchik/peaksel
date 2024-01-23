'use client'
import { FC, ReactNode, memo, useState } from 'react'
import styles from './FilterItem.module.scss'
import cn from 'classnames'
import { Input } from '@/shared/ui/Input'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Button } from '@/shared/ui/Button'
import { UseFormRegister } from 'react-hook-form'
import { IFilterData } from '../CatalogFilter'
import { BrandFilter } from './BrandFilter'

interface IFilterOptions {
    type?: 'options'
    options?: {
        name: string
        value: string | number
    }[]
    visibleCount?: number
}
interface IFilterRange {
    type?: 'number-range'
    from?: {
        minValue?: string | number
    }
    to?: {
        maxValue?: string | number
    }
}
interface IFilterSearch {
    type?: 'search'
    placeholder?: string
}

interface IFilterBaseProps {
    children?: ReactNode
    className?: string
    title?: string
    name: string
    isLoading?: boolean
}

export type IFilterItemProps = (IFilterOptions | IFilterRange | IFilterSearch) & IFilterBaseProps

export const FilterItem: FC<IFilterItemProps & {
    register: UseFormRegister<IFilterData>; searchParams: ReadonlyURLSearchParams
}> = (props) => {
    const {
        children,
        className,
        title,
        type,
        register,
        name,
        searchParams,
        isLoading
    } = props

    const FilterItemWrapper = memo(({ children }: { children?: ReactNode }) => (
        <li className={cn(className, styles.wrapper)}>
            <h4>{title}</h4>
            {children}
        </li>
    ))

    const [isVisible, setIsVisible] = useState(false)

    if (type === 'number-range') {
        const {
            from,
            to,
            searchParams
        } = props

        const rangeLimits = searchParams.size
            ? [searchParams.get(`${name}_from`), searchParams.get(`${name}_to`)] : []

        return (
            <FilterItemWrapper>
                <div className={styles.numRangeWrapper}>
                    <Input placeholder={`от ${from?.minValue || ''}`}
                        // name={`${name}_from`}
                        inputMode='decimal' type='number' defaultValue={rangeLimits[0] || undefined}
                        //@ts-ignore
                        {...register(`${name}_from`, {})}
                    />
                    <Input placeholder={`до ${to?.maxValue || ''}`}
                        // name={`${name}_to`}
                        inputMode='decimal' type='number' defaultValue={rangeLimits[1] || undefined}
                        //@ts-ignore
                        {...register(`${name}_to`, {})}
                    />
                </div>
            </FilterItemWrapper>
        )
    } else if (type === 'options') {
        const {
            options,
            visibleCount = 5,
            searchParams
        } = props
        const selectedOptions = searchParams.size ? searchParams.getAll(name) : []

        return (
            <FilterItemWrapper>
                <ul className={styles.options}>
                    {options && options.map((el, idx) => (
                        <li key={`${name}_${el.value}_${el.name}`} className={
                            cn(idx + 1 > visibleCount && !isVisible && styles.hidden)
                        }>
                            <Checkbox
                                id={`${name}_${el.value}`}
                                title={el.name}
                                value={el.value}
                                defaultChecked={!!selectedOptions.includes(`${el.value}`)}
                                //@ts-ignore
                                {...register(name, {})}
                            />
                        </li>
                    ))}
                    {options && options.length > visibleCount && (
                        <Button onClick={() => setIsVisible(p => !p)} 
                            type='button' className={styles.showBt}
                            disabled={isLoading}
                        >
                            {isVisible ? 'Скрыть' : `Раскрыть ${options.length - visibleCount}`}
                        </Button>
                    )}
                </ul>
            </FilterItemWrapper>
        )
    } else if (type === 'search') {
        const { placeholder } = props

        return (
            <FilterItemWrapper>
                <Input placeholder={placeholder || 'Найти'} />
            </FilterItemWrapper>
        )
    } else if (name === 'brand') return (
        <FilterItemWrapper>
            <BrandFilter register={register} searchParams={searchParams}/>
        </FilterItemWrapper>
    )

    return (
        <FilterItemWrapper>
            {children}
        </FilterItemWrapper>
    )


}