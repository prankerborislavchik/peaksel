import { FC, ReactNode } from 'react'
import styles from '../TelevisionPage.module.scss'
import cn from 'classnames'
import { ITelevision } from '@/shared/types/Television'

interface IExtraInformationProps extends Pick<
    Partial<ITelevision>, 'vesaFixingStandard' | 'power' | 'creationYear' 
    | 'blackoutZonesAmount' | 'hasBlackoutTechnology'>{
    children?: ReactNode
    className?: string
}

export const ExtraInformation: FC<IExtraInformationProps> = (props) => {
    const { className, vesaFixingStandard, power, 
        creationYear, hasBlackoutTechnology, blackoutZonesAmount 
    } = props

    const formattedScreenData = {
        'Потребляемая мощность': power ? `${power} Вт` : undefined,
        'Стандарт крепления VESA': vesaFixingStandard,
        'Год создания модели': creationYear,
        'Поддерживает технологию затемнения?': hasBlackoutTechnology ? 'Поддерживает' 
            : hasBlackoutTechnology === false ? 'Не поддерживает' : undefined,
        'Количество зон затемнения': blackoutZonesAmount
    }

    return power || vesaFixingStandard || creationYear || blackoutZonesAmount || hasBlackoutTechnology ? (
        <li className={cn(className)}>
            <h3 className={styles.characteristicsTitle}>Дополнительная информация</h3>
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