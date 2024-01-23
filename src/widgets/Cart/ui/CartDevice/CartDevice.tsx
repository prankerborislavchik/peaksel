import { ReactNode, memo, useEffect, useState } from 'react'
import styles from '../Cart.module.scss'
// import cn from 'classnames'
import { ICartData } from '@/app/api/(routes)/cart/route'
import { Button } from '@/shared/ui/Button'
import Image from 'next/image'
import TrashBinIcon from '@/shared/assets/trash-bin-icon.svg'
import { Input } from '@/shared/ui/Input'
import { NonNullableDeep } from '@/shared/types/NonNullableDeep'

type TCartDevice = NonNullableDeep<ICartData['cart']['cart_devices'][0]>  

export interface ICartDeviceProps extends TCartDevice {
    children?: ReactNode
    className?: string
    handleDelete(cartDeviceId: string): void
    handleQuantityUpdate(tvId: string, newCount?: number): void
}

export const CartDevice = memo((props: ICartDeviceProps): ReactNode => {
    const {
        id: cartDeviceId,
        quantity,
        television: { id: tvId, img, name, price },
        handleQuantityUpdate,
        handleDelete,
    } = props

    const [tvAmount, setTvAmount] = useState(() => quantity)
    const [isEditMode, setIsEditMode] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        if (!isEditMode) {
            if (tvAmount < 1 || Number.isNaN(tvAmount)) {
                setIsDeleting(true)
                setTvAmount(quantity)
            }
            if (tvAmount !== quantity && tvAmount >= 1) handleQuantityUpdate(tvId, tvAmount)
        }
        if (isEditMode && !Number.isNaN(tvAmount) && tvAmount !== quantity && tvAmount >= 1) {
            handleQuantityUpdate(tvId, tvAmount)
        }
    }, [tvAmount, tvId, handleQuantityUpdate, quantity, handleDelete, cartDeviceId, isEditMode])

    useEffect(() => {
        if (isDeleting) {
            handleDelete(cartDeviceId)
            setIsDeleting(false)
        }
    }, [cartDeviceId, handleDelete, isDeleting])

    return (
        <li className={styles.listItem}>
            <Image src={img} alt={name} width={120} height={90} />
            <div className={styles.middle}>
                <strong className={styles.tvName}>{name}</strong>
                <div className={styles.quantityBlock}>
                    <Button color='clear' className={styles.quantityBtn}
                        onClick={() => setTvAmount(p => {
                            if (p - 1 < 1) {
                                setIsDeleting(true)
                            }
                            return p - 1 || quantity
                        })}
                    >-</Button>
                    <Input
                        type='number'
                        className={styles.quantityInput}
                        step={1} min={0} max={99}
                        value={tvAmount || ''}
                        onChange={e => setTvAmount(+e.target.value > 99
                            ? +e.target.value.slice(0, 2) : +e.target.value)}
                        onFocus={() => setIsEditMode(true)}
                        onBlur={() => setIsEditMode(false)}
                    />
                    <Button color='clear' className={styles.quantityBtn}
                        onClick={() => setTvAmount(p => p + 1 > 99 ? 99 : p + 1)}
                    >+</Button>
                </div>
                <p className={styles.price}>{price}₽/Шт.</p>
            </div>
            <div className={styles.right}>
                <Button color='danger' className={styles.trashBtn} onClick={() => handleDelete(cartDeviceId)}>
                    <TrashBinIcon className={styles.icon} />
                </Button>
                <p>{quantity * parseFloat(price)}₽</p>
            </div>
        </li>
    )
})