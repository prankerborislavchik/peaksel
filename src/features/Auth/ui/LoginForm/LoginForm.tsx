'use client'
import { FC, ReactNode, useState } from 'react'
import styles from './LoginForm.module.scss'
import cn from 'classnames'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useIsLoading } from '@/shared/hooks/useIsLoading'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { emailRegexp } from '@/shared/lib/helpers/email-regexp'

interface ILoginFormProps {
    children?: ReactNode
    className?: string
}

interface ILoginData {
    email: string
    password: string
}

export const LoginForm: FC<ILoginFormProps> = (props) => {
    const { className } = props

    const [isLoading] = useIsLoading()
    const [message, setMessage] = useState("")

    const { register, formState: { errors }, handleSubmit, setError } = useForm<ILoginData>()

    const queryClient = useQueryClient()
    const { isPending, mutateAsync } = useMutation({
        mutationFn: (data: ILoginData) => fetch('/api/auth/login', { 
            method: "POST", body: JSON.stringify(data) 
        })
    })

    const submitHandler: SubmitHandler<ILoginData> = async (authData) => {
        try {
            const res = await mutateAsync(authData)

            const { data } = await res.json()
            if (!res.ok) throw new Error(data.message)
            // Ошибку не вернуло - получается залогинился 
            queryClient.invalidateQueries({ queryKey: ['userData'] })
            setMessage(data.message)
        } catch (error) {
            if (error instanceof Error) {
                setError('root', { message: error.message })
            }
        }    
    }


    return (
        <div className={cn("container", styles.container, className)}>
            <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
                <h2 className={styles.heading}>Авторизация</h2>
                <div className={styles.inputGroup}>
                    <Input placeholder="Почта пользователя"
                        {...register("email", {
                            required: {
                                value: true,
                                message: "Введите почту для входа"
                            },
                            maxLength: {
                                value: 254,
                                message: "Слишком длинная почта"
                            },
                            pattern: {
                                value: emailRegexp,
                                message: 'Введите валидный email'
                            },
                            onChange() {
                                setError('root', {})
                            },
                        })}
                        error={errors.email?.message ? new Error(errors.email.message) : undefined}
                        className={cn({ [styles.success]: !!message })}
                        disabled={!!message}
                    />
                    <Input placeholder="Пароль" type="password"
                        {...register("password", {
                            required: {
                                value: true,
                                message: "Введите пароль для входа"
                            },
                            maxLength: {
                                value: 65,
                                message: "Слишком длинный пароль."
                            },
                            onChange() {
                                setError('root', {})
                            },
                        })}
                        error={errors.password?.message ? new Error(errors.password.message) : undefined}
                        className={cn({ [styles.success]: !!message })}
                        disabled={!!message}
                    />
                </div>
                {errors.root?.message && <div className={styles.error}>{errors.root.message}</div>}
                {message && <div className={styles.success}>{message}</div>}
                <div className={styles.bottom}>
                    <div>
                        <p className={styles.reg}>
                            Нет аккаунта? <Link href='/registration' className={styles.link}>
                                Зарегистрироваться
                            </Link>
                        </p>
                        <p className={styles.reset}>
                            Забыли пароль? <Link href={'/recover-password'} className={styles.link}>
                                Восстановить
                            </Link>
                        </p>
                    </div>
                    <Button disabled={isPending || isLoading || !!message}>
                        {isPending ? "Запрос" : "Войти"}
                    </Button>
                </div>
            </form>
        </div>
    )
}