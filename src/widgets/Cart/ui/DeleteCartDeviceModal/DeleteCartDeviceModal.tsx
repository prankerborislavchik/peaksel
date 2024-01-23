import { FC, ReactNode } from 'react'
import styles from '../Cart.module.scss'
import { Modal } from '@/shared/ui/Modal'
import { Button } from '@/shared/ui/Button'

interface IDeleteCartDeviceModalProps {
    children?: ReactNode
    className?: string
    cartDeviceId: string | null
    deleteCartDevice(cartDeviceId: string): void
    onClose(): void
}

export const DeleteCartDeviceModal: FC<IDeleteCartDeviceModalProps> = (props) => {
    const { cartDeviceId, deleteCartDevice, onClose } = props

    const handleDelete = () => {
        deleteCartDevice(`${cartDeviceId}`)
        onClose()
    }
    return (
        <Modal
            isOpen={!!cartDeviceId}
            onClose={onClose}
        >
            <h3 className={styles.deleteHeading}>Удаление товара</h3>
            <p className={styles.text}>
                Удалить выбранный товар? <br />
                Отменить действие будет невозможно.
            </p>
            <div className={styles.actionBlock}>
                <Button color='danger' onClick={handleDelete}>Удалить</Button>
                <Button onClick={onClose}>Оставить</Button>
            </div>
        </Modal>
    )
}