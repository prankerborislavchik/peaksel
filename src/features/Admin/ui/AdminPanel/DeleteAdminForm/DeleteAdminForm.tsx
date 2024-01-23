'use client'
import { FC, ReactNode } from 'react'
import s from './DeleteAdminForm.module.scss'
import styles from '@/features/Admin/ui/Admin.module.scss'
import cn from 'classnames'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { useForm } from 'react-hook-form'
import { emailRegexp } from '@/shared/lib/helpers/email-regexp'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface IDeleteAdminFormProps {
    children?: ReactNode
    className?: string
}

interface IDeleteAdminFormData {
    email: string
}

export const DeleteAdminForm: FC<IDeleteAdminFormProps> = (props) => {

    const { className } = props

    const { register, handleSubmit, formState: { errors }, setError } = useForm<IDeleteAdminFormData>()
    
    const queryClient = useQueryClient()
    const { data, isPending, mutateAsync } = useMutation({
        async mutationFn(adminData: IDeleteAdminFormData) {
            const response = await fetch('/api/admin', { method: 'DELETE', body: JSON.stringify(adminData) })
            const { data: {message} } = await response.json()
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) queryClient
                    .invalidateQueries({ queryKey: ['userData'] })
                setError('email', {message})
                throw new Error(message)
            }
            return message
        },
        retry: false
    })

    return (
        <li className={cn(className, styles.form, s.form)}>
            <h3>Форма удаления админа</h3>
            <form className={cn(s.formWrapper)} onSubmit={handleSubmit((userData) => mutateAsync(userData))}>
                <div className={styles.inputWrapper}>
                    <Input placeholder='Введи почту' {...register('email', {
                        pattern: {
                            value: emailRegexp,
                            message: "Введи валидную почту"
                        },
                        required: {
                            value: true,
                            message: "Введи почту"
                        }
                    })}
                    error={errors.email?.message ? new Error(errors.email.message) : undefined}
                    className={data ? styles.success : ''}
                    disabled={!!data}
                    />
                    {data && <span className={styles.success}>{data}</span>}
                </div>
                <Button type='submit' color='danger' disabled={isPending || data}>
                    {data ? "Успешно забрана" : "Забрать роль администратора"}
                </Button>
            </form>
        </li>
    )
}