'use client'
import { FC, ReactNode } from 'react'
import styles from '@/features/Admin/ui/Admin.module.scss'
import cn from 'classnames'
import { Input } from '@/shared/ui/Input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IBrand } from '../SearchBrandForm/SearchBrandForm'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/ui/Button'
import { DefaultLoader } from '@/shared/ui/Loaders'

interface IEditBrandFormProps {
    children?: ReactNode
    className?: string
    name: string
}

export const EditBrandForm: FC<IEditBrandFormProps> = (props) => {
    const { className, name } = props

    const { handleSubmit, register, formState: { errors }, setError } = useForm<Omit<IBrand, 'id'>>()

    const { invalidateQueries } = useQueryClient()

    const {isLoading, data, error} = useQuery({
        queryKey: ['brand', name],
        async queryFn() {
            const res = await fetch(`/api/brand/${name}`)
            const {data} = await res.json()
            
            if (!res.ok) {
                setError('name', { message: ' ' })
                setError('description', { message: ' ' })
                setError('logoImg', { message: ' ' })
                setError('root', {message})
                throw new Error(data.message)
            }
            return data as IBrand
        },
        retry: false,
    })

    const { mutateAsync, isPending, data: message } = useMutation({
        async mutationFn(brandData: Omit<IBrand, 'id'>) {
            if (!data) throw new Error('Непредвиденная ошибка') 
            const res = await fetch('/api/brand', { 
                method: 'PUT', 
                body: JSON.stringify({ ...brandData, id: data.id }) 
            })
            const { data: {message} } = await res.json()

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) invalidateQueries({ queryKey: ['userData'] })
                setError('name', { message: ' ' })
                setError('description', { message: ' ' })
                setError('logoImg', { message: ' ' })
                setError('root', {message})
                throw new Error(message)
            }

            return message
        },
        retry: false
    })

    if (isLoading) return <div className={className}><DefaultLoader/></div>
    if (error?.message) return <div className={className}>
        <h2 className={styles.error}>{error.message}</h2>
    </div>

    return (
        <div className={cn(className)}>
            <form className={styles.form} onSubmit={handleSubmit((data) => mutateAsync(data))}>
                <h2>Форма редактирования бренда</h2>
                <Input placeholder='Название бренда'
                    defaultValue={data?.name} 
                    {...register('name', {
                        required: {
                            value: true,
                            message: 'Имя обязательно для заполнения'
                        },
                        minLength: {
                            value: 1,
                            message: 'Слишком короткое название бренда'
                        },
                        maxLength: {
                            value: 27,
                            message: 'Слишком длинное название у бренда, да'
                        }
                    })}
                    error={errors.name?.message ? new Error(errors.name.message) : undefined}
                    disabled={!!message}
                    className={message ? styles.success : ''}
                />
                <Input placeholder='Ссылка на лого'
                    defaultValue={data?.logoImg} 
                    {...register('logoImg', {
                        required: {
                            value: true,
                            message: 'Ну добавь ссылку на лого'
                        },
                        minLength: {
                            value: 1,
                            message: "Ну добавь ссылку на лого"
                        }
                    })}
                    error={errors.logoImg?.message ? new Error(errors.logoImg.message) : undefined}
                    disabled={!!message}
                    className={message ? styles.success : ''}
                />
                <Input placeholder='Ну, описание'
                    defaultValue={data?.description} 
                    {...register('description', {

                    })}
                    error={errors.description?.message ? new Error(errors.description.message) : undefined}
                    disabled={!!message}
                    className={message ? styles.success : ''}
                />
                {errors.root?.message && <div className={styles.error}>{errors.root.message}</div>}
                {!!message && <div className={styles.success}>{message}</div>}
                <Button disabled={isLoading || isPending || message}>Изменить</Button>
            </form>


        </div>
    )
}