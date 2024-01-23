'use client'
import { FC, ReactNode } from 'react'
import styles from '../Television.module.scss'
import cn from 'classnames'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'

interface IDeleteTelevisionFormProps {
    children?: ReactNode
    className?: string
}

export const DeleteTelevisionForm: FC<IDeleteTelevisionFormProps> = (props) => {
    const { className } = props

    const {register, handleSubmit, formState: {errors}} = useForm<{televisionName: string}>()

    const {mutateAsync, data, isPending} = useMutation({
        async mutationFn(televisionName: string) {
            const res = await fetch('/api/televisions', {
                method: 'DELETE', body: JSON.stringify({televisionName})
            })
            const {data} = await res.json()
            if (!res.ok) throw new Error(data.message)

            return (data.message || 'Телевизор отсутствует в БД') as string
        }
    })

    return (
        <li className={cn(className)}>
            <div className={styles.formWrapper}>
                <h3>Удаление телевизора</h3>
                <form 
                    onSubmit={handleSubmit((data) => mutateAsync(data.televisionName))} 
                    className={styles.form}
                >
                    <Input placeholder='Название телевизора' 
                        {...register('televisionName', {
                            required: {
                                value: true, 
                                message: "Данное поле обязательно для заполнения"
                            },
                            maxLength: {
                                value: 500,
                                message: 'Слишком длинное название телевизора'
                            }
                        })}
                        className={cn(data && styles.success)}
                        disabled={!!data}
                        error={errors.televisionName?.message 
                            ? new Error(errors.televisionName.message) : undefined}
                    />
                    {data && <div className={styles.success}>{data}</div>}
                    <Button color='danger' disabled={!!data || isPending}>
                        {isPending ? 'Удаление...' : 'Удалить телевизор'}
                    </Button>
                </form>
            </div>
        </li>
    )
}