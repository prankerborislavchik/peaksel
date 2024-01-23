import { FC, ReactNode } from 'react'
import styles from './Header.module.scss'
import cn from 'classnames'
import Image from 'next/image'
import peaksel from '@/shared/assets/peaksel-320x50.png'
import Link from 'next/link'
import { CallUs } from '@/features/CallUs'
import { User } from '@/features/User'

interface IHeaderProps {
    className?: string
    children: ReactNode
}

export const Header: FC<IHeaderProps> = (props) => {

    const { className, children } = props

    return (
        <header className={cn(className, styles.wrapper)}>
            <div className={cn(styles.top)}>
                <div className={cn("container", styles.container)}>
                    <CallUs />
                    <User />
                </div>
            </div>
            <div className={cn(styles.bottom)}>
                <div className={cn("container", styles.container)}>
                    <Link className={styles.logo} href='/'>
                        <Image src={peaksel} alt='Peaksel Logo' width={128} className={styles.smallImg}/>
                        <Image src={peaksel} alt='Peaksel Logo' width={256} className={styles.bigImg}/>
                        <Image src={peaksel} alt='Peaksel Logo' width={160} className={styles.mediumImg}/>
                    </Link>
                    {children}
                </div>
            </div>
        </header>
    )
}