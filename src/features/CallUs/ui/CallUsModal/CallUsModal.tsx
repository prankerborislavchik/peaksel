import { 
    ClipboardEventHandler, FC, 
    FormEventHandler, KeyboardEventHandler, 
    ReactNode, RefObject, useState 
} from 'react'
import styles from './CallUsModal.module.scss'
import cn from 'classnames'
import { Modal } from '@/shared/ui/Modal'
import { Input } from '@/shared/ui/Input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/shared/ui/Button'
import { useIsLoading } from '@/shared/hooks/useIsLoading'
import { phoneRegex } from '@/shared/lib/helpers/phone-regexp'

interface ICallUsModalProps {
    children?: ReactNode
    className?: string
    isOpen?: boolean
    handleClose?: () => void
    inputRef?: RefObject<HTMLInputElement>
}

interface IFormInput {
    phoneNumber: string
}

export const CallUsModal: FC<ICallUsModalProps> = (props) => {
    
    const {
        isOpen,
        handleClose,
        inputRef
    } = props
    
    const {
        register,
        handleSubmit,
        // formState: { errors },
    } = useForm<IFormInput>({});
    const [errorMsg, setErrorMsg] = useState('')

    
    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        console.log(data)
    }
    
    const getPhoneNumbers = (str: string) => {
        return str.replace(/\D/g, '');
    }
    
    const onPhoneInput: FormEventHandler<HTMLInputElement> = (event) => {
        setErrorMsg('')
        const input = event.currentTarget
        let phoneNumbers = getPhoneNumbers(input.value)
        let newPhoneString = ''
        
        if (!phoneNumbers) return input.value = ''
        
        if (input.value.length != input.selectionStart) {
            // Editing in the middle of input, not last symbol
            // @ts-ignore 
            if (event.nativeEvent?.data && /\D/g.test(event.nativeEvent?.data)) {
                // Attempt to input non-numeric symbol
                input.value = phoneNumbers;
            }
            return;
        }
        
        if (phoneNumbers.startsWith('7') || phoneNumbers.startsWith('8') || phoneNumbers.startsWith('9')) {
            // ru номера
            if (phoneNumbers.startsWith('9')) phoneNumbers = '7' + phoneNumbers
            const firstSymb = phoneNumbers[0] === '7' ? '+7' : "8"
            newPhoneString += firstSymb + ' '
            
            if (phoneNumbers.length > 1) {
                newPhoneString += '(' + phoneNumbers.substring(1, 4)
            }
            if (phoneNumbers.length >= 5) {
                newPhoneString += ') ' + phoneNumbers.substring(4, 7)
            }
            if (phoneNumbers.length >= 8) {
                newPhoneString += '-' + phoneNumbers.substring(7, 9)
            }
            if (phoneNumbers.length >= 10) {
                newPhoneString += '-' + phoneNumbers.substring(9, 11)
            }
            input.value = newPhoneString
        } else {
            // не ru номера
            input.value = '+7 (' + phoneNumbers.substring(0, 16)
        }
        
    }
    
    const onPhoneKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
        const input = event.currentTarget
        const inputValue = getPhoneNumbers(input.value)
        
        
        if (event.keyCode == 8 && inputValue.length <= 1) {
            return input.value = ''
        }
        
    }
    
    const onPhonePaste: ClipboardEventHandler<HTMLInputElement> = (event) => {
        const input = event.currentTarget
        let phoneNumbers = getPhoneNumbers(input.value)
        const pasted = event.clipboardData || window.Clipboard
        
        if (pasted) {
            const pastedText = pasted.getData('Text');
            if (/\D/g.test(pastedText)) {
                // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
                // formatting will be in onPhoneInput handler
                input.value = phoneNumbers;
                return;
            }
        }
    }
    
    const [isLoading, setIsLoading] = useIsLoading()
    const clickHandler = async () => {
        if (inputRef?.current) {
            
            const phoneNumber = inputRef.current.value
            
            const isValid = phoneRegex.test(phoneNumber)
            
            if (isValid) {
                setIsLoading(true)
                const res = await fetch('/api/phone-number', {
                    method: "POST", body: JSON.stringify({phoneNumber})
                })
                setIsLoading(false)
                const {data: {message}} = await res.json()
                console.log(message)
                
            } else {
                setErrorMsg('Введите валидный номер телефона')
            }
        }
    }
    
    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className={cn(styles.wrapper)}>
                <h2>Оставьте свой номер, и мы вам перезвоним!</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Input
                        type='tel'
                        inputSize='L'
                        autoComplete='tel'
                        maxLength={18}
                        placeholder='+7 (___) ___-__-__'
                        {...register('phoneNumber', {
                            maxLength: {
                                value: 18,
                                message: 'Номер телефона содержит слишком много цифр',
                            },
                            required: {
                                message: 'Заполните номер телефона для дальнейшей связи!',
                                value: true
                            },
                            pattern: {
                                value: phoneRegex,
                                message: 'Введите действительный номер телефона'
                            }, 
                        })}
                        error={!!errorMsg ? new Error(errorMsg) : undefined}
                        errorClassName={styles.error}
                        ref={inputRef}
                        onInput={onPhoneInput}
                        onKeyDown={onPhoneKeyDown}
                        onPaste={onPhonePaste}
                        className={styles.input}
                    />
                    <Button size='L' type='submit' onClick={clickHandler} disabled={isLoading}>
                        {isLoading ? "Сохраняем" : "Отправить" }
                    </Button>
                </form>
            </div>
        </Modal>
    )
}