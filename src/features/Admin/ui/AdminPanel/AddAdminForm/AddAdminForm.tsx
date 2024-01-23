'use client'
import { FC, ReactNode } from 'react'
import styles from '@/features/Admin/ui/Admin.module.scss'
import s from './AddAdminForm.module.scss'
import cn from 'classnames'
import { Input } from '@/shared/ui/Input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/shared/ui/Button'
import { emailRegexp } from '@/shared/lib/helpers/email-regexp'

interface IAddAdminFormProps {
    children?: ReactNode
    className?: string
}

interface IFormData {
    email: string
}

export const AddAdminForm: FC<IAddAdminFormProps> = (props) => {

    const { className } = props

    const { handleSubmit, register, formState: {errors: {email: emailErr}}, setError } = useForm<IFormData>()
    const queryClient = useQueryClient()

    const { data, mutateAsync, isPending } = useMutation({
        mutationFn: async (emailData: IFormData) => {
            const res = await fetch('/api/admin', { 
                method: "PATCH", 
                body: JSON.stringify(emailData)
            })
            const {data} = await res.json()
            if (!res.ok) {
                if (res.status === 403 || res.status === 401) {
                    queryClient.invalidateQueries({queryKey: ['userData']})
                } 
                throw new Error(data.message || 'Произошла непредвиденная ошибка')
            }
            
            return data
        }
    })

    const submitHandler: SubmitHandler<IFormData> = async (data) => {
        try {
            await mutateAsync(data)
        } catch (error) {
            if (error instanceof Error) {
                return setError('email', {message: error.message})
            }
            setError('email', {message: "Произошла непредвиденная ошибка"})
        }
    }

    return (
        <li className={cn(className, styles.form, s.form)}>
            <h3>Форма добавления администратора</h3>
            <form onSubmit={handleSubmit(submitHandler)} className={s.formWrapper}>
                <div className={styles.inputWrapper}>
                    <Input
                        {...register("email", {
                            required: {
                                value: true,
                                message: "Напиши почту"
                            },
                            minLength: {
                                value: 5,
                                message: "Ну слишком короткий email"
                            },
                            maxLength: {
                                value: 320,
                                message: "Ну слишком длинный email"
                            },
                            pattern: {
                                value: emailRegexp,
                                message: "Введи валидный email"
                            }
                        })}
                        className={data?.message && styles.success}
                        disabled={!!data?.message}
                        error={emailErr?.message ? new Error(emailErr.message) : undefined}
                        placeholder='Введи почту'
                    /> 
                    {data?.message && <span className={styles.success}>{data.message}</span>}
                </div> 
                <Button type='submit' disabled={isPending || data?.message}>Добавить администратора</Button>
            </form>
        </li>
    )
}