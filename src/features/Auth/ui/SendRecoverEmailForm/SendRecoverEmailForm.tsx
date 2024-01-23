'use client'
import { FC, ReactNode, useState } from 'react'
import styles from '../LoginForm/LoginForm.module.scss'
import cn from 'classnames'
import { Input } from '@/shared/ui/Input'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/ui/Button'
import { useIsLoading } from '@/shared/hooks/useIsLoading'
import Link from 'next/link'
import { emailRegexp } from '@/shared/lib/helpers/email-regexp'

interface IResetPasswordFormProps {
    children?: ReactNode
    className?: string
}

export const SendRecoverEmailForm: FC<IResetPasswordFormProps> = (props) => {

    const { className } = props
    const [isLoading] = useIsLoading()
    const [isSending, setIsSending] = useState(false)
    const [answer, setAnswer] = useState('')

    const { handleSubmit, formState: { errors }, register, setError } = useForm<{ email: string }>()

    async function submitHandler(data: { email: string }) {
        try {
            setIsSending(true)
            const res = await fetch('/api/auth/reset-password', { 
                method: "PATCH", 
                body: JSON.stringify(data) 
            })
            setIsSending(false)
            const { data: { message } } = await res.json()
            if (!res.ok) throw new Error(message)
            setAnswer(message)
        } catch (error) {
            if (error instanceof Error) return setError("email", { ...error, message: error.message })
            setError("email", { message: "Произошла непредвиденная ошибка" })
        }

    }

    return (
        <div className={cn("container", styles.container, className)}>
            <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
                <h2 className={styles.heading}>Восстановление пароля</h2>
                <div className={styles.inputGroup}>
                    <Input placeholder="Почта"
                        {...register("email", {
                            required: {
                                value: true,
                                message: "Введите свой email"
                            },
                            pattern: {
                                value: emailRegexp,
                                message: 'Введите валидный email'
                            },
                            maxLength: {
                                value: 254,
                                message: "Слишком длинный email"
                            }
                        })}
                        error={new Error(errors.email?.message || '')}
                        disabled={!!answer}
                    />
                </div>
                {answer}
                <div className={cn(styles.bottom)}>
                    <div>
                        <p className={styles.reg}>
                            Нет аккаунта? <Link href='/registration' className={styles.link}>
                                Зарегистрироваться
                            </Link>
                        </p>
                        <p className={styles.login}>
                            Помните пароль? <Link href='/login' className={styles.link}>Войти</Link>
                        </p>
                    </div>
                    <Button type='submit' disabled={isLoading || isSending || !!answer}>
                        {isSending ? "Отправка" : "Восстановить"}
                    </Button>
                </div>
            </form>
        </div>
    )
}