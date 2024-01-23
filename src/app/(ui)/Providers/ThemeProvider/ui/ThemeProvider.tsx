'use client'
import { FC, ReactNode, useEffect, useState } from 'react'
import { LOCAL_STORAGE_THEME_KEY, Theme, ThemeContext } from './ThemeContext'
// import { useLocalStorage } from '@/shared/lib/useLocalStorage'

interface IThemeProviderProps {
    children: ReactNode
}

export const ThemeProvider: FC<IThemeProviderProps> = (props) => {

    const [theme, setTheme] = useState<null | Theme>(null)
    const { children } = props

    const changeTheme = (newTheme: Theme | null) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_THEME_KEY, JSON.stringify(newTheme))
            setTheme(newTheme)
        }
    }

    useEffect(() => {
        // @ts-ignore
        // Шиза какая-то
        const defaultValue: Theme | null = JSON.parse(localStorage.getItem(LOCAL_STORAGE_THEME_KEY)) 
        setTheme(defaultValue)
    }, [])

    // const { value: theme, changeValue: setNewTheme } = useLocalStorage<Theme>(LOCAL_STORAGE_THEME_KEY)

    return (
        <ThemeContext.Provider value={{ theme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}