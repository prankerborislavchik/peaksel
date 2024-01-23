'use client'
import { FC, ReactNode } from 'react'
import styles from '@/features/Admin/ui/Admin.module.scss'
import s from './DeleteBrandForm.module.scss'
import cn from 'classnames'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { IBrand } from '../SearchBrandForm/SearchBrandForm'
import { useForm } from 'react-hook-form'
import { useIsLoading } from '@/shared/hooks/useIsLoading'
import { useQueryClient, useMutation } from '@tanstack/react-query'

interface IDeleteBrandFormProps {
    children?: ReactNode
    className?: string
}

export const DeleteBrandForm: FC<IDeleteBrandFormProps> = (props) => {

    const { className } = props

    const { handleSubmit, register, formState: { errors }, setError } = useForm<Pick<IBrand, 'name'>>()
    const {invalidateQueries} = useQueryClient()

    const { mutateAsync, isPending, data } = useMutation({
        mutationFn: async (brandData: Pick<IBrand, 'name'>) => {
            const res = await fetch(`/api/brand/${brandData.name}`, {method: 'DELETE'})
            const { data: {message} } = await res.json()

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) invalidateQueries({queryKey: ['userData']})
                setError('name', { message })
                throw new Error(message)
            }

            return message
        },
        retry: false,
    })

    const [isLoading] = useIsLoading()    

    return (
        <li className={cn(className, s.formWrapper)}>
            <h3>Удаление бренда</h3>
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
                    disabled={!!data || isPending}
                    className={(!!data && styles.success) || ''}
                    />
                    {!!data && <div className={styles.success}>{data}</div>}
                </div>
                <Button disabled={isLoading || isPending || !!data} color='danger'>
                    {!!data ? "Успешно удалён" : 'Удалить бренд'}
                </Button>
            </form>
        </li>
    )
}