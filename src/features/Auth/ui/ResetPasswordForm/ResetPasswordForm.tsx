'use client'
import { FC, ReactNode, useState } from 'react'
import styles from '../LoginForm/LoginForm.module.scss'
import cn from 'classnames'
import { Input } from '@/shared/ui/Input'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from '@/shared/ui/Button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DefaultLoader } from '@/shared/ui/Loaders'

interface IResetPasswordFormProps {
    children?: ReactNode
    className?: string
    resetToken: string
}

interface IResetPasswordFormData {
    password: string
    repeatPassword: string
}

export const ResetPasswordForm: FC<IResetPasswordFormProps> = (props) => {
    
    const { className, resetToken } = props
    const { handleSubmit, formState: { errors }, register, setError } = useForm<IResetPasswordFormData>()
    const [answer, setAnswer] = useState('')

    const queryClient = useQueryClient()

    const { isLoading, isError, error, } = useQuery({
        queryKey: ['resetPassword', resetToken],
        queryFn: async () => {
            const res = await fetch(`/api/auth/reset-password/${resetToken}`)
            const { data } = await res.json()
 
            if (!res.ok) throw new Error(data.message)
            return data.message
        },
        retry: false
    })

    const {isPending, mutateAsync, error: mutationError} = useMutation({
        async mutationFn(passwordData: IResetPasswordFormData) {
            const res = await fetch(`/api/auth/reset-password/${resetToken}`, {
                method: "PATCH", body: JSON.stringify(passwordData)
            })
            const {data} = await res.json()

            if (!res.ok) throw Error(data.message)   
            queryClient.invalidateQueries({queryKey: ["userData"]})
            return data.message
        },
        retry: false
    })


    const submitHandler: SubmitHandler<IResetPasswordFormData> = async (data) => {
        if (data.password !== data.repeatPassword) return setError("repeatPassword", {
            message: "Пароли не совпадают"
        })
        try {
            const message = await mutateAsync(data)
            setAnswer(message)
        } catch (error) {
            if (error instanceof Error) return setError("root", {message: error.message})
            setError("root", { message: "Произошла непредвиденная ошибка"})
        }
    }

    if (isLoading) return (
        <div className="container center">
            <DefaultLoader />
        </div>
    )

    if (isError) return (
        <div className={cn("container", styles.container, className)}>
            <h1>{error.message}</h1>
        </div>
    )

    return (
        <div className={cn("container", styles.container, className)}>
            <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
                <h2 className={styles.heading}>Восстановление пароля</h2>
                <div className={styles.inputGroup}>
                    <Input placeholder="Новый пароль" type="password"
                        {...register("password", {
                            required: {
                                value: true,
                                message: "Введите пароль для восстановления"
                            },
                            maxLength: {
                                value: 64,
                                message: "Слишком длинный пароль"
                            },
                            onChange() {
                                setError("root", {})
                            }
                        })}
                        disabled={!!answer}
                        error={new Error(errors.password?.message || '')}
                        className={cn({[styles.success]: !!answer})}
                    />
                    <Input placeholder="Повторите пароль" type="password"
                        {...register("repeatPassword", {
                            required: {
                                value: true,
                                message: "Повторите пароль"
                            },
                            maxLength: {
                                value: 64,
                                message: "Слишком длинный пароль"
                            },
                            onChange() {
                                setError("root", {})
                            }
                        })}
                        disabled={!!answer}
                        error={new Error(errors.repeatPassword?.message || '')}
                        className={cn({[styles.success]: !!answer})}
                    />
                </div>
                {mutationError && <div className={styles.error}>{mutationError.message}</div>}
                {answer && <div className={styles.success}>{answer}</div>}
                <div className={styles.bottom}>
                    <Button type='submit' disabled={isLoading || isPending || !!answer}>
                        {isPending ? "Отправка" : "Восстановить"}
                    </Button>
                </div>
            </form>
        </div>
    )
}