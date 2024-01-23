'use client'
import { useCallback, useEffect, useState } from "react"

export const useIsLoading = () => {
    const [isLoading, sIsLoading] = useState<boolean>(true)
    // Зачем оно надо? Просто ругалось, что функция поменяла свой размер при вызове. Так не выдаёт
    const setIsLoading = useCallback((isLoading: boolean) => sIsLoading(isLoading), [])
    useEffect(() => {sIsLoading(false)}, [])

    return [isLoading, setIsLoading] as const
}