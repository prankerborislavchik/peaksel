'use client'
import { FC, ReactNode } from 'react'
import styles from '../Television.module.scss'
import cn from 'classnames'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface IEditTelevisionFormProps {
    children?: ReactNode
    className?: string
}

export const EditTelevisionForm: FC<IEditTelevisionFormProps> = (props) => {

    const { className } = props

    const { register, handleSubmit, formState: { errors }, setError } = useForm<{ televisionName: string }>()

    const { push } = useRouter()

    const { mutateAsync, isPending } = useMutation({
        async mutationFn(televisionName: string) {
            const res = await fetch(`/api/televisions?name=${televisionName}`)
            const { data } = await res.json()

            if (!data?.totalCount) return setError('televisionName', { 
                message: data.message || 'Телевизор отсутствует в Базе Данных' 
            })

            const {id} = data.televisions[0] as {id?: string}

            if (!id) return setError('televisionName', { 
                message: data.message || 'Телевизор отсутствует в Базе Данных' 
            })

            push(`/admin/edit-tv/${id}`)

        },
        retry: false,
    })


    return (
        <li className={cn(className)}>
            <div className={styles.formWrapper}>
                <h3>Редактирование телевизора</h3>
                <form
                    onSubmit={handleSubmit(({ televisionName }) => mutateAsync(televisionName))}
                    className={styles.form}
                >
                    <Input
                        {...register('televisionName', {
                            required: {
                                value: true,
                                message: "Введи название телевизора для редактирования"
                            },
                            maxLength: {
                                value: 500,
                                message: "Слишком длинное название телевизора"
                            }
                        })}
                        placeholder='Название телевизора'
                        error={errors.televisionName?.message 
                            ? new Error(errors.televisionName.message) : undefined}
                    />
                    <Button disabled={isPending}>
                        {isPending ? 'Поиск...' : 'Найти телевизор'}
                    </Button>
                </form>
            </div>
        </li>
    )
}