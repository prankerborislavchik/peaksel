import { FC, ReactNode } from 'react'
import styles from '../TelevisionPage.module.scss'
import cn from 'classnames'
import { ITelevision } from '@/shared/types/Television'

interface IMultimediaCharacteristicsProps extends Pick<Partial<ITelevision>, 'supportSmartTv' | 'tvTuner'>{
    children?: ReactNode
    className?: string
}

export const MultimediaCharacteristics: FC<IMultimediaCharacteristicsProps> = (props) => {
    const { className, supportSmartTv, tvTuner } = props

    const formattedScreenData = {
        'Поддерживает Smart Tv?': supportSmartTv 
            ? 'Поддерживает' : supportSmartTv === false ? 'Не поддерживает' : undefined,
        'ТВ-тюнер': tvTuner?.join(', ')
    }

    return supportSmartTv || tvTuner?.length ? (
        <li className={cn(className)}>
            <h3 className={styles.characteristicsTitle}>Мультимедиа</h3>
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