'use client'
import { FC, ReactNode, useState } from 'react'
import styles from '../ContactUs.module.scss'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { useIsLoading } from '@/shared/hooks/useIsLoading'
import { SubmitHandler, useForm } from 'react-hook-form'
import cn from 'classnames'

interface IContactUsFormProps {
    children?: ReactNode
    className?: string
}

interface IContactRequestData {
    sender: string
    message: string
}

export const ContactUsForm: FC<IContactUsFormProps> = (props) => {

    const [isLoading] = useIsLoading()
    const [isSending, setIsSending] = useState(false)

    const {register, formState: {errors}, handleSubmit} = useForm<IContactRequestData>()

    const submitHandler: SubmitHandler<IContactRequestData> = async (data) => {
        setIsSending(true)
        await fetch('/api/contact-us', {method: 'POST', body: JSON.stringify(data)})
        setIsSending(false)
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
            <h1>Обратная связь</h1>
            <Input placeholder="Ваши данные" {...register("sender", {
                required: {
                    value: true,
                    message: "Введите ваши контактные данные"
                },
                maxLength: {
                    value: 120,
                    message: "Слишком длинный контакт"
                }
            })} 
            error={errors.sender?.message ? new Error(errors.sender.message) : undefined}
            />
            <textarea
                className={cn(styles.textarea, {[styles.error]: !!errors.message?.message})}
                placeholder="Введите ваше сообщение"
                rows={5}
                {...register('message', {
                    required: {
                        value: true,
                        message: "Напиши письмо"
                    },
                    maxLength: {
                        value: 1000,
                        message: "Слишком длинное сообщение. Попробуй уложиться в 1000 символов"
                    },
                    minLength: {
                        value: 2,
                        message: "Ну напиши письмо"
                    }
                })}
            />
            {errors.message?.message && <span className={styles.errorMsg}>{errors.message.message}</span>}
            <Button type='submit' disabled={!!isLoading || isSending} className={styles.btn}>
                {isSending ? "Отправляем ваш запрос" : "Связаться с нами"}
            </Button>
        </form>
    )
}