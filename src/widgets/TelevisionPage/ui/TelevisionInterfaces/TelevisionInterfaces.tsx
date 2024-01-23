import { FC, ReactNode } from 'react'
import styles from '../TelevisionPage.module.scss'
import cn from 'classnames'
import { ITelevision } from '@/shared/types/Television'

interface ITelevisionInterfacesProps extends Pick<
    Partial<ITelevision>, 'hdmiPorts' | 'hdmiVersion' | 'usbAmount' | 'wifiStandard' | 'wirelessConnection'> {
    children?: ReactNode
    className?: string
}

export const TelevisionInterfaces: FC<ITelevisionInterfacesProps> = (props) => {
    const { className, ...tvInterfaces } = props

    const formattedScreenData = {
        'Количество HDMI разъёмов': tvInterfaces.hdmiPorts ? `${tvInterfaces.hdmiPorts}` : undefined,
        'Версия интерфейса HDMI': tvInterfaces.hdmiVersion,
        'Количество USB разъёмов': tvInterfaces.usbAmount ? `${tvInterfaces.usbAmount}` : undefined,
        'Беспроводные интерфейсы': tvInterfaces.wirelessConnection?.join(', '),
        'Стандарт Wi-FI': tvInterfaces.wifiStandard,
    }

    return Object.values(tvInterfaces).some(value => (
        Array.isArray(value) ? !!value.length : !!value)) ? (<li className={cn(className)}>
            <h3 className={styles.characteristicsTitle}>Разъёмы и интерфейсы</h3>
            <ul>
                {Object.entries(formattedScreenData).map(([key, value]) => value ? (
                    <li key={key} className={styles.characteristic}>
                        <strong>{key}:</strong> <p>{value}</p>
                    </li>
                ) : null)}
            </ul>
        </li>) : null
}