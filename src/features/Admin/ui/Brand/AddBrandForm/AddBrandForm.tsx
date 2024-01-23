'use client'
import { FC, ReactNode } from 'react'
import styles from '@/features/Admin/ui/Admin.module.scss'
import cn from 'classnames'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Input } from '@/shared/ui/Input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/shared/ui/Button'

interface IAddBrandFormProps {
    children?: ReactNode
    className?: string
}

interface IBrandData {
    name: string
    logoImg: string
    description: string
}

export const AddBrandForm: FC<IAddBrandFormProps> = (props) => {

    const { className } = props

    const {handleSubmit, register, formState: {errors}, setError} = useForm<IBrandData>()

    const queryClient = useQueryClient()

    const {data, isPending, mutateAsync} = useMutation({
        mutationFn: async (brandData: IBrandData) => {
            const res = await fetch('/api/brand', {method: 'POST', body: JSON.stringify(brandData)})
            const {data} = await res.json()
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) queryClient
                    .invalidateQueries({queryKey: ['userData']})
                setError('name', {message: ' '})
                setError('logoImg', {message: ' '})
                setError('description', {message: ' '})
                setError('root', {message: data.message})

                throw new Error(data.message)
            }
            return data.message
        },
        retry: false
    })

    const submitHandler: SubmitHandler<IBrandData> = async (data) => {
        try {
            await mutateAsync(data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={cn(className)}>
            <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
                <h2>Форма добавления бренда</h2>
                <Input 
                    placeholder='Название бренда' 
                    {...register('name', {
                        required: {
                            value: true,
                            message: "Ну название бренда точно обязательно"
                        },
                        minLength: {
                            value: 1,
                            message: "Ну больше одного символа надо"
                        },
                        maxLength: {
                            value: 27,
                            message: "Слишком длинное название бренда"
                        }
                    })}
                    className={data && styles.success}
                    disabled={!!data}
                    error={errors.name?.message ? new Error(errors.name.message) : undefined}
                />
                <Input 
                    placeholder='Ссылку на лого' 
                    {...register('logoImg', {
                        required: {
                            value: true,
                            message: "Ну как будто ссылка на лого нужна всё-таки"
                        }
                    })}
                    className={data && styles.success}
                    disabled={!!data}
                    error={errors.logoImg?.message ? new Error(errors.logoImg.message) : undefined}
                />
                <Input 
                    placeholder='Описание по желанию накинуть можешь' 
                    {...register('description')}
                    className={data && styles.success}
                    disabled={!!data}
                    error={errors.description?.message ? new Error(errors.description.message) : undefined}
                />
                {errors.root?.message && <div className={styles.error}>{errors.root.message}</div>}
                {data && <div className={styles.success}>{data}</div>}
                <Button type='submit' disabled={isPending || data}>Добавить</Button>
            </form>
        </div>
    )
}