"use client"
import { createContext } from "react";

export type Theme = `app_${'dark' | 'light'}_theme`

export interface IThemeContextDefaultValue {
    theme?: Theme | null
    changeTheme?: (newTheme: Theme | null) => void 
}

export const LOCAL_STORAGE_THEME_KEY = 'theme'

export const ThemeContext = createContext<IThemeContextDefaultValue>({})