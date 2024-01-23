"use client"
import { FC, ReactNode, useEffect, useState } from 'react'
import styles from './ThemeSwitcher.module.scss'
import cn from 'classnames'
import { useTheme } from '@/app/(ui)/Providers/ThemeProvider/lib/useTheme/useTheme'
import { Button } from '@/shared/ui/Button'
import ThemeIcon from '@/shared/assets/theme-icon.svg'
import DarkThemeIcon from '@/shared/assets/dark-theme-icon.svg'
import LightThemeIcon from '@/shared/assets/light-theme-icon.svg'
import { useIsLoading } from '@/shared/hooks/useIsLoading'

interface IThemeSwitcherProps {
    children?: ReactNode
    className?: string
}

export const ThemeSwitcher: FC<IThemeSwitcherProps> = (props) => {
    const { className } = props

    const [isOpen, setIsOpen] = useState(false)
    const { theme, setTheme } = useTheme()

    const [isLoading] = useIsLoading()

    useEffect(() => {
        const clickHandler = () => setIsOpen(false)
        if (isOpen) document.body.addEventListener('click', clickHandler)
        
        return () => {
            document.body.removeEventListener('click', clickHandler)
        }
    }, [isOpen])

    return (
        <div className={cn(className, styles.wrapper, theme && styles[theme])}>
            <Button
                color='clear'
                onClick={() => setIsOpen(p => !p)}
                disabled={!!isLoading}
            >
                {theme ? theme === 'app_dark_theme'
                    ? <DarkThemeIcon className={cn(styles.icon, styles.darkIcon)} />
                    : <LightThemeIcon className={cn(styles.icon, styles.lightIcon)} />
                    : <ThemeIcon className={cn(styles.icon, styles.defaultIcon)} />
                }
            </Button>
            <ul className={cn(styles.themeList, { [styles.opened]: isOpen })}>
                <li 
                    className={cn({ [styles.isActive]: theme === 'app_dark_theme' }, 
                        styles.darkIconWrapper, styles.iconWrapper)}>
                    <Button
                        color='clear' size='S' 
                        className={styles.btn}
                        onClick={() => {
                            setIsOpen(false)
                            setTheme('app_dark_theme')
                        }}
                    >
                        <DarkThemeIcon className={cn(styles.icon, styles.darkIcon)} />
                    </Button>
                </li>
                <li 
                    className={cn({ [styles.isActive]: theme === 'app_light_theme' }, styles.iconWrapper)}>
                    <Button
                        color='clear' size='S' 
                        className={styles.btn}
                        onClick={() => {
                            setIsOpen(false)
                            setTheme('app_light_theme')
                        }}
                    >
                        <LightThemeIcon className={cn(styles.icon, styles.lightIcon)} />
                    </Button>
                </li>
                <li 
                    className={cn({ [styles.isActive]: theme == null }, styles.iconWrapper)}>
                    <Button
                        color='clear' size='S' 
                        className={styles.btn}
                        onClick={() => {
                            setIsOpen(false)
                            setTheme(null)
                        }}
                    >
                        <ThemeIcon className={cn(styles.icon, styles.defaultIcon)} />
                    </Button>
                </li>
            </ul>
        </div>
    )
}