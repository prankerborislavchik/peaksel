import { FC, ReactNode } from 'react'
import styles from '../TelevisionPage.module.scss'
import cn from 'classnames'
import { ITelevision } from '@/shared/types/Television'

interface IScreenProps extends Partial<
    Pick<ITelevision, 'diagonal' | 'hdResolution' | 'resolution' | 'hdrFormat' | 'screenType'
        | 'illuminationType' | 'tvFormat' | 'matrix' | 'screenTechnology' | 'brightness' | 'contrast'
        | 'dynamicContrast' | 'viewAngle' | 'pixelResponseTime' | 'screenRefreshRate' | 'dynamicSceneIdx'>
> {
    children?: ReactNode
    className?: string
}

export const ScreenCharacteristics: FC<IScreenProps> = (props) => {
    const { 
        className, diagonal, hdResolution, resolution, hdrFormat, screenType, 
        tvFormat, illuminationType, matrix, screenTechnology, brightness, contrast,
        dynamicContrast, viewAngle, pixelResponseTime, screenRefreshRate, dynamicSceneIdx 
    } = props

    const formattedScreenData = {
        'Диагональ': diagonal ? `${diagonal}"` : undefined,
        'Разрешение HD': hdResolution,
        'Разрешение': resolution,
        'Форматы HDR': hdrFormat?.join(', '),
        'Тип экрана': screenType,
        'Формат телевизора': tvFormat,
        'Тип подсветки': illuminationType?.join(', '),
        'Тип матрицы экрана': matrix, 
        'Технология экрана': screenTechnology?.join(', '), 
        'Яркость': brightness ? `${brightness} кд/м2` : undefined, 
        'Контрастность': contrast, 
        'Динамическая контрастность': dynamicContrast, 
        'Угол обзора': viewAngle ? `${viewAngle} градусов` : undefined, 
        'Время отклика пикселя': pixelResponseTime ? `${pixelResponseTime} мс` : undefined, 
        'Частота обновления экрана': screenRefreshRate ? `${screenRefreshRate} Гц` : undefined, 
        'Индекс динамических сцен': dynamicSceneIdx ? `${dynamicSceneIdx}` : undefined, 
    }

    return (
        <li className={cn(className)}>
            <h3 className={styles.characteristicsTitle}>Экран</h3>
            <ul>
                {Object.entries(formattedScreenData).map(([key, value]) => value ? (
                    <li key={key} className={styles.characteristic}>
                        <strong>{key}:</strong> <p>{value}</p>
                    </li>
                ): null)}
            </ul>
        </li>
    )
}