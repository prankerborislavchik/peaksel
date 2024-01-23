'use client'
import { useContext, useEffect, useCallback } from 'react'
import { Theme, ThemeContext } from "@/app/(ui)/Providers/ThemeProvider/ui/ThemeContext"

export const useTheme = () => {

    const { theme, changeTheme } = useContext(ThemeContext)

    const setTheme = useCallback((newTheme: Theme | null) => {
        if (changeTheme) changeTheme(newTheme)
    }, [changeTheme])

    useEffect(() => {
        if (theme) document.body.dataset.appTheme = theme
        else document.body.dataset.appTheme = ''
    }, [theme])

    return { theme, setTheme }
}