'use client'
import { FC, ReactNode, useEffect } from 'react'
import cn from 'classnames'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useIsLoading } from '@/shared/hooks/useIsLoading'
import { useRouter } from 'next/navigation'
import styles from '@/features/Admin/ui/Admin.module.scss'
import s from './SearchBrandForm.module.scss'

interface ISearchBrandFormProps {
    children?: ReactNode
    className?: string
}

export interface IBrand {
    name: string
    logoImg: string
    description: string 
    id: string
}

export const SearchBrandForm: FC<ISearchBrandFormProps> = (props) => {

    const { className } = props
    
    const {handleSubmit, register, formState: {errors}, setError} = useForm<Pick<IBrand, 'name'>>()
    
    const {invalidateQueries} = useQueryClient()
    const {mutateAsync, isPending, data} = useMutation({
        mutationFn: async (brandData: Pick<IBrand, 'name'>) => {
            const res = await fetch(`/api/brand/${brandData.name}`)
            const {data} = await res.json()
            
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) invalidateQueries({queryKey: ['userData']})
                setError('name', {message: data.message})
                throw new Error(data.message)
            }
            
            return data as IBrand
        }
    })
    
    const {push} = useRouter()

    useEffect(() => {
        if (data && data.id) push(`/admin/edit-brand/${data.name}`)
    }, [data, push])

    const [isLoading] = useIsLoading()

    return (
        <li className={cn(className, s.formWrapper)}>
            <h3>Редактирование бренда</h3>
            <form className={cn(s.form)} onSubmit={handleSubmit((data) => mutateAsync(data))}>
                <div className={styles.inputWrapper}>
                    <Input placeholder='Введи название бренда' {...register('name', {
                        required: {
                            value: true,
                            message: 'Данное поле обязательно для заполнения'
                        },
                        minLength: {
                            value: 1,
                            message: "Слишком короткое название бренда"
                        },
                        maxLength: {
                            value: 27,
                            message: 'Слишком длинное название бренда'
                        }
                    })}
                    error={errors.name?.message ? new Error(errors.name.message) : undefined}
                    disabled={isPending}
                    />
                </div>
                <Button disabled={isLoading || isPending}>Найти бренд</Button>
            </form>
        </li>
    )
}