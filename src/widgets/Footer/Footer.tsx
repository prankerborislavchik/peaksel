import { FC } from 'react'
import styles from './Footer.module.scss'
import cn from 'classnames'
import WhatsAppIcon from '@/shared/assets/whatsapp-icon.svg'
import TelegramIcon from '@/shared/assets/telegram-icon.svg'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/shared/assets/peaksel-320x50.png'

interface IFooterProps {
    className?: string
}

export const Footer: FC<IFooterProps> = (props) => {

    const { className } = props

    return (
        <footer className={cn(className, styles.wrapper)}>
            <div className={cn('container', styles.container)}>
                <div className={styles.customerHelp}>
                    <h2 className={styles.mainHeading}>Помощь покупателю</h2>
                    <h3 className={styles.heading}>Связаться с нами</h3>
                    <ul className={styles.SMListWrapper}>
                        <li>
                            <Link href={'/'}>
                                <TelegramIcon className={cn(styles.icon, styles.telegramIcon)} />
                            </Link>
                        </li>
                        <li>
                            <Link href={'/'}>
                                <WhatsAppIcon className={cn(styles.icon, styles.whatsAppIcon)} />
                            </Link>
                        </li>
                    </ul>
                </div>
                <strong className={styles.copyright}>©Пиксель 2023</strong>
                <Link href='/'>
                    <Image src={logo} alt='Логотип peaksel' width={160} />
                </Link>
            </div>
        </footer>
    )
}