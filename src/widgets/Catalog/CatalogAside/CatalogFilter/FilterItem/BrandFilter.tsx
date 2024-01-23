import { FC, ReactNode, useState } from 'react'
import cn from 'classnames'
import { UseFormRegister } from 'react-hook-form'
import { IFilterData } from '../CatalogFilter'
import { useQuery } from '@tanstack/react-query'
// import { DefaultLoader } from '@/shared/ui/Loaders'
import { Button } from '@/shared/ui/Button'
import styles from './FilterItem.module.scss'
import { Checkbox } from '@/shared/ui/Checkbox'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { Skeleton } from '@/shared/ui/Skeleton'

interface IBrandFilterProps {
    children?: ReactNode
    className?: string
    register: UseFormRegister<IFilterData>
    searchParams: ReadonlyURLSearchParams
}

interface IBrand {
    id: string
    name: string
    rating: string | number
    logoImg: string
    // ...
}

export const BrandFilter: FC<IBrandFilterProps> = (props) => {
    const { register, searchParams } = props
    const visibleCount = 5

    const { data: brands, isLoading } = useQuery({
        queryKey: ['brand'],
        async queryFn() {
            const response = await fetch('/api/brand')
            const { brands } = await response.json()

            return brands as IBrand[]
        }
    })
    const [isVisible, setIsVisible] = useState(false)

    const selectedOptions = searchParams.size ? searchParams.getAll('brand') : []
    
    if (isLoading) return <Skeleton className={styles.skeleton}/>
    if (brands) return (
        <ul className={cn(styles.options, styles.brands)}>
            {brands.map(({ name, id }, idx) => (
                <li key={id} className={
                    cn(idx + 1 > visibleCount && !isVisible && styles.hidden)
                }>
                    <Checkbox
                        id={id}
                        title={name}
                        value={id}
                        defaultChecked={!!selectedOptions.includes(id)}
                        {...register('brand')}
                    />
                </li>
            ))}
            {brands.length > visibleCount && (
                <Button onClick={() => setIsVisible(p => !p)} type='button'>
                    {isVisible ? 'Скрыть' : `Раскрыть ${brands.length - visibleCount}`}
                </Button>
            )}
        </ul>
    )
}