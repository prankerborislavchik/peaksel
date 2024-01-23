'use client'
import { FC, ReactNode, useEffect, useState } from 'react'
import styles from '../LoginForm/LoginForm.module.scss'
import cn from 'classnames'
import { Input } from '@/shared/ui/Input'
import Link from 'next/link'
import { Button } from '@/shared/ui/Button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { emailRegexp } from '@/shared/lib/helpers/email-regexp'

interface IRegistrationFormProps {
    children?: ReactNode
    className?: string
}

interface IRegisterData {
    name: string,
    email: string,
    password: string
    repeatPassword: string
}

const requiredFieldMsg = "Данное поле обязательно для заполнения"

export const RegistrationForm: FC<IRegistrationFormProps> = (props) => {

    
    const {
        handleSubmit,
        register,
        formState: { errors, },
        setError,
    } = useForm<IRegisterData>()
    
    const router = useRouter()
    const submitHandler: SubmitHandler<IRegisterData> = async (data) => {
        if (data.password !== data.repeatPassword) {
            return setError("repeatPassword", {message: 'Пароли не совпадают'})
        }
    
        setIsLoading(true)
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        })
        setIsLoading(false)
        
        if (!response.ok) return setError("email", {
            message: "Пользователь с данным email уже зарегистрирован"
        })

        router.push('registration-confirm')
    }

    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setIsLoading(false)
    }, [])

    return (
        <div className={cn("container", styles.container)}>
            <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
                <h2 className={styles.heading}>Регистрация</h2>
                <div className={styles.inputGroup}>
                    <Input placeholder="Имя пользователя"
                        {...register("name", {
                            required: {
                                value: true,
                                message: requiredFieldMsg
                            },
                            maxLength: {
                                value: 24,
                                message: "Слишком длинное имя"
                            },
                            minLength: {
                                value: 2,
                                message: "Имя должно состоять из 2ух и более букв"
                            },

                        })}
                        error={new Error(errors.name?.message || '')}
                    />
                    <Input placeholder="Почта"
                        {...register("email", {
                            required: {
                                value: true,
                                message: requiredFieldMsg
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
                    />
                    <Input placeholder="Пароль" type="password"
                        {...register("password", {
                            required: {
                                value: true,
                                message: requiredFieldMsg
                            },
                            maxLength: {
                                value: 64,
                                message: "Слишком длинный пароль"
                            },
                        })}
                        error={new Error(errors.password?.message || '')}
                    />
                    <Input placeholder="Повторите пароль" type="password"
                        {...register("repeatPassword", {
                            required: {
                                value: true,
                                message: requiredFieldMsg
                            },
                            maxLength: {
                                value: 64,
                                message: "Слишком длинный пароль"
                            },
                        })}
                        error={new Error(errors.repeatPassword?.message || '')}
                    />
                </div>
                <div className={styles.bottom}>
                    <p className={styles.reg}>
                        Уже есть аккаунт? <Link href='/login' className={styles.link}>Войти</Link>
                    </p>
                    <Button type='submit' disabled={isLoading}>Зарегистрироваться</Button>
                </div>
            </form>
        </div>
    )
}