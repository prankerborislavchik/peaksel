'use client'
import { FC } from 'react'
import cn from 'classnames'
import { Button } from '@/shared/ui/Button'

interface IErrorPageProps {
    error: Error
    reset(): void
}

const ErrorPage: FC<IErrorPageProps> = ({error, reset}) => {
    return (
        <div className={cn('container center')}>
            {JSON.stringify(error, null, 4)} <br /> <br />
            <Button onClick={reset}>Попробовать снова</Button>
        </div>
    )
}

export default ErrorPage