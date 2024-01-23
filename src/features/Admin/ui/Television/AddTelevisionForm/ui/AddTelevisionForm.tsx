'use client'
import { FC, ReactNode } from 'react'
import styles from './AddTelevisionForm.module.scss'
import cn from 'classnames'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Controller, useForm } from 'react-hook-form'
import { ITelevision } from '@/shared/types/Television'
import { InputRadio } from '@/shared/ui/InputRadio'
import { ManyOptions } from './Options/ManyOptions'
import { OneOfManyOptions } from './Options/OneOfManyOptions'
import AsyncSelect from 'react-select/async';
import { OptionsOrGroups, GroupBase, StylesConfig } from 'react-select';
import { TVFeatures } from '../model/features'
import { Textarea } from '@/shared/ui/Textarea'
import { IBrand } from '@/shared/types/Brand'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface IAddTelevisionFormProps {
    children?: ReactNode
    className?: string
}

export type TTelevision = ITelevision 

export const AddTelevisionForm: FC<IAddTelevisionFormProps> = (props) => {

    const { className } = props

    const { handleSubmit, register, formState: { errors }, control, setError } = useForm<TTelevision>({
        defaultValues: {
            wirelessConnection: [],
            illuminationType: [],
            hdrFormat: [],
            screenTechnology: [],
            tvTuner: [],
        }
    })
    
    const { invalidateQueries } = useQueryClient()
    const { isPending, mutateAsync, data: successMessage } = useMutation({
        // fetch('/api/television')
        async mutationFn(tvData: ITelevision) {
            const res = await fetch('/api/televisions', { method: 'POST', body: JSON.stringify(tvData) })

            const { data } = await res.json()
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) invalidateQueries({ queryKey: ['userData'] })
                setError('root', {message: data.message})
                throw new Error(data.message)
            }
            return data.message
        },
        retry: false
    })

    function loadOptions(
        inputValue: string,
        callback: (options: OptionsOrGroups<unknown, GroupBase<unknown>>) => void
    ) {
        fetch('/api/brand').then(res => res.json()).then(({ brands }: { brands: IBrand[] }) => {
            callback(brands.map(({ id, name }) => ({ value: id, label: name, color: "var(--text-color)" })))
        }).catch(console.error)
    }

    const colorStyles: StylesConfig<unknown, false, GroupBase<unknown>> = {
        control: (styles) => ({
            ...styles, backgroundColor: 'var(--bg-color-secondary)',
            borderColor: errors.manufacturer?.message && 'var(--error-red)'
        }),
        option: (styles) => ({
            ...styles, backgroundColor: "var(--bg-color-secondary) !important", color: 'var(--text-color)',
            borderRadius: '4px', marginTop: '0.4rem'
        }),
        menu: styles => ({
            ...styles, background: 'var(--bg-color-inverted)',
            border: '1px solid var(--text-color)', padding: '0 0.4rem 0.4rem 0.4rem',
        }),
        singleValue: styles => ({ ...styles, color: 'var(--text-color) !important' }),
    }

    return (
        <div className={cn(className)}>
            <form onSubmit={handleSubmit((data) => mutateAsync(data))} className={styles.form} noValidate>
                <h2>Форма добавления телевизора</h2>
                <div className={styles.featuresWrapper}>
                    <ul className={styles.featuresList}>
                        {TVFeatures.map(feature => {
                            const { type, title, name } = feature
                            if (type === 'input') {
                                const { options = {}, placeholder, inputType = 'text' } = feature
                                const errFieldMsg = errors[name]?.message
             
                                return (
                                    <li key={name} className={styles.featuresItem}>
                                        <h4>{title}</h4>
                                        {inputType === 'textarea' ?
                                            <Textarea placeholder={placeholder}
                                                id={`${name}_input`}{...register(name, options)}
                                                error={errFieldMsg ? new Error(errFieldMsg) : undefined}
                                                disabled={successMessage}
                                                className={successMessage && styles.success}
                                            /> :
                                            <Input
                                                placeholder={placeholder}
                                                id={`${name}_input`}
                                                type={inputType}
                                                inputMode={inputType === 'number' ? 'decimal' : undefined}
                                                {...register(name, options)}
                                                error={errFieldMsg ? new Error(errFieldMsg) : undefined}
                                                disabled={successMessage}
                                                className={successMessage && styles.success}
                                            />
                                        }
                                    </li>
                                )
                            }
                            if (type === 'true/false') {
                                const { options, trueValue, falseValue } = feature
                                const errFieldMsg = errors[name]?.message

                                return (
                                    <li key={name} className={styles.featuresItem}>
                                        <h4>{title}</h4>
                                        <div>
                                            <InputRadio
                                                title={trueValue.title}
                                                id={`${name}_true`} {...register(name, {
                                                    ...options
                                                })}
                                                value={'true'}
                                                error={errFieldMsg ? new Error(errFieldMsg) : undefined}
                                                disabled={successMessage}
                                            />
                                        </div>
                                        <div>
                                            <InputRadio
                                                title={falseValue.title}
                                                id={`${name}_false`} {...register(name, {
                                                    ...options
                                                })}
                                                value={'false'}
                                                error={errFieldMsg ? new Error(errFieldMsg) : undefined}
                                                disabled={successMessage}
                                            />
                                        </div>
                                    </li>
                                )
                            }
                            if (type === 'one-of-many') {
                                const { name, options, visibleCount, validationOptions } = feature
                                const errFieldMsg = errors[name]?.message

                                return <OneOfManyOptions name={name} options={options}
                                    register={register} title={title} key={name} visibleCount={visibleCount}
                                    validationOptions={validationOptions}
                                    error={errFieldMsg ? new Error(errFieldMsg) : undefined}
                                    disabled={successMessage}
                                    radioClassName={cn(successMessage && styles.success)}
                                />
                            }

                            if (type === 'many-options') {
                                const { name, options, visibleCount, validationOptions } = feature
                                const errFieldMsg = errors[name]?.message

                                return <ManyOptions name={name} options={options} register={register}
                                    title={title} key={name} visibleCount={visibleCount}
                                    validationOptions={validationOptions}
                                    error={errFieldMsg ? new Error(errFieldMsg) : undefined}
                                    disabled={successMessage}
                                    checkboxClassName={cn(successMessage && styles.success)}
                                />
                            }

                            if (type === 'manufacturer') {

                                return (
                                    <li key={name} className={styles.featuresItem}>
                                        <h4>{title}</h4>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: "Бренд обязательно должен быть указан"
                                                }
                                            }}
                                            name='manufacturer'
                                            render={({ field }) => (
                                                <AsyncSelect
                                                    loadOptions={loadOptions} defaultOptions={true}
                                                    cacheOptions={true} isSearchable={false}
                                                    styles={colorStyles} placeholder={'Бренд производителя'}
                                                    loadingMessage={() => 'Загрузка...'}
                                                    name={field.name}
                                                    ref={field.ref}
                                                    //@ts-ignore
                                                    onChange={val => field.onChange(val.value)}
                                                />
                                            )}
                                        />
                                        {errors.manufacturer?.message && (
                                            <div className={styles.error}>{errors.manufacturer.message}</div>
                                        )}
                                    </li>
                                )
                            }
                        })}

                        {errors.root?.message && <div className={styles.error}>{errors.root.message}</div>}
                    </ul>
                </div>
                <Button type='submit' disabled={isPending || successMessage}>
                    {isPending ? "Ну грузится получается"
                        : successMessage ? 'Телевизор успешно добавлен' : "Ну создать получается"}
                </Button>
            </form>
        </div>
    )
}