import { FC, ReactNode } from 'react'
import styles from '../TelevisionPage.module.scss'
import cn from 'classnames'
import { ITelevision } from '@/shared/types/Television'

interface ISoundProps extends Partial<Pick<ITelevision, | 'dynamicsCount' | 'totalSoundPower'>>{
    children?: ReactNode
    className?: string
}

export const SoundCharacteristics: FC<ISoundProps> = (props) => {
    const { className, totalSoundPower, dynamicsCount } = props

    const formattedScreenData = {
        'Суммарная мощность звука': totalSoundPower ? `${totalSoundPower} Вт` : undefined,
        'Количество динамиков': dynamicsCount
    }

    return totalSoundPower || dynamicsCount ? (
        <li className={cn(className)}>
            <h3 className={styles.characteristicsTitle}>Звук</h3>
            <ul>
                {Object.entries(formattedScreenData).map(([key, value]) => value ? (
                    <li key={key} className={styles.characteristic}>
                        <strong>{key}:</strong> <p>{value}</p>
                    </li>
                ): null)}
            </ul>
        </li>
    ) : null
}