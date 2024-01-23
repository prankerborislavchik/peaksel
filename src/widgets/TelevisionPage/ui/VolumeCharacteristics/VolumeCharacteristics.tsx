import { FC, ReactNode } from 'react'
import styles from '../TelevisionPage.module.scss'
import cn from 'classnames'
import { ITelevision } from '@/shared/types/Television'

interface IVolumeCharacteristicsProps extends Pick<
    Partial<ITelevision>, 'width' | 'height' | 'depth' | 'weight'>{
    children?: ReactNode
    className?: string
}

export const VolumeCharacteristics: FC<IVolumeCharacteristicsProps> = (props) => {
    const { className, depth, height, weight, width } = props

    const formattedScreenData = {
        'Ширина': width ? `${width} мм` : undefined,
        'Высота': height ? `${height} мм` : undefined,
        'Глубина': depth ? `${depth} мм` : undefined,
        'Вес': weight ? `${weight} кг` : undefined,
    }

    return depth || height || weight || width ? (
        <li className={cn(className)}>
            <h3 className={styles.characteristicsTitle}>Габариты</h3>
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