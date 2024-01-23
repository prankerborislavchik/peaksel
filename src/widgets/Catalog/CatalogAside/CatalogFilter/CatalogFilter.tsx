'use client'
import { FC, ReactNode } from 'react'
import styles from './CatalogFilter.module.scss'
import cn from 'classnames'
import { FilterItem } from './FilterItem/FilterItem'
import FilterIcon from '@/shared/assets/filter-icon.svg'
import { Button } from '@/shared/ui/Button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { filters } from './filters'
import {objToQueryStr} from '@/shared/lib/objToQueryStr'
import { useIsLoading } from '@/shared/hooks/useIsLoading'

interface ICatalogFilterProps {
    children?: ReactNode
    className?: string
}

export interface IFilterData {
    price_from: string
    price_to: string
    diagonal_from: string
    diagonal_to: string
    brand: string[] | false
    hdResolution: string[] | false
    hdmiPorts: string[] | false
    resolution: string[] | false
    screenRefreshRate: string[] | false
    screenType: string[] | false
    screenTechnology: string[] | false
    // ...
}

export const CatalogFilter: FC<ICatalogFilterProps> = (props) => {
    const { className } = props
    const { push } = useRouter()
    const { handleSubmit, register } = useForm<IFilterData>({
        defaultValues: {
            hdResolution: [],
            brand: [],
            screenRefreshRate: [],
            screenTechnology: [],
            resolution: [],
            screenType: [],
            hdmiPorts: []
        },
    })
    const [isLoading] = useIsLoading()
    
    const submitHandler = (data: IFilterData) => {
        console.log(JSON.stringify(data))
        push(`/shop${objToQueryStr(data)}`, {scroll: false})
    }
    const searchParams = useSearchParams()
    
    return (
        <form noValidate onSubmit={(handleSubmit(submitHandler))} className={styles.form}>
            <h3 className={styles.heading}><FilterIcon className={cn(styles.filterIcon)} /> Фильтры</h3>
            <ul className={cn(className, styles.filters)}>
                {filters.map(filter => <FilterItem register={register} searchParams={searchParams} 
                    {...filter} key={filter.name} isLoading={isLoading}/>
                )}
            </ul>
            <div className={styles.btnGroup}>
                <Button type='submit' disabled={isLoading}>Применить</Button>
                <Button 
                    type='button' disabled={isLoading}
                    onClick={() => {push('/', {scroll: false})}} 
                    color='danger'
                >
                    Сбросить
                </Button>
            </div>
        </form>
    )
}