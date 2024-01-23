import { FC, ReactNode } from 'react'
// import styles from './DefaultLayout.module.scss'
// import cn from 'classnames'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { AppRouter } from '../../Providers/AppRouter'

interface IDefaultLayoutProps {
    children?: ReactNode
    className?: string
}

export const DefaultLayout: FC<IDefaultLayoutProps> = (props) => {

    const { children } = props

    return (
        <div className='wrapper'>
            <Header className='header'>
                <AppRouter />
            </Header>
            <main className={"main"}>
                {children}
            </main>
            <Footer className='footer' />
        </div>
    )
}