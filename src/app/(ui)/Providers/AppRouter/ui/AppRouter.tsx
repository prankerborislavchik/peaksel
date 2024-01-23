'use client'
import { FC, ReactNode } from 'react'
import styles from './AppRouter.module.scss'
import cn from 'classnames'
import Link from 'next/link'
import peaksel from '@/shared/assets/peaksel-320x50.png'
import Image from 'next/image'
import { Burger } from '@/widgets/Header/Burger/Burger'
import { usePathname } from 'next/navigation'

interface IAppRouterProps {
    children?: ReactNode
    className?: string
}

interface IAppRoute {
    href: string
    title: string | ReactNode
}

export const AppRouter: FC<IAppRouterProps> = (props) => {
    const { className } = props

    const routes: IAppRoute[] = [
        {
            href: '/',
            title: 'Ассортимент'
        },
        {
            href: '/contact-us',
            title: "Связь с нами"
        },
        // {
        //     href: "/discount",
        //     title: "Телевизоры со скидкой"
        // },
    ]
    const pathname = usePathname()

    return (
        <Burger>
            <nav className={cn(className, styles.navBar)}>
                <ul className={styles.navList}>
                    <li className={cn(styles.navItem, styles.logo)}>
                        <Link href='/'>
                            <Image src={peaksel} alt='Логотип peaksel' width={220} />
                        </Link>
                    </li>
                    {routes.map((value) => (
                        <li className={styles.navItem} key={value.href}>
                            <Link href={value.href}
                                className={cn(
                                    (value.href === '/'
                                        // Если на магазине, то сравниваем с / и /shop
                                        ? (pathname === '/' || pathname.startsWith('/shop')) 
                                        : pathname === value.href
                                    ) && styles.active)}
                            >
                                {value.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </Burger>
    )
}