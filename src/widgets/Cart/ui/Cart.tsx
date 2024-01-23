'use client'
import { FC, ReactNode, useCallback, useState, JSX } from 'react'
import styles from './Cart.module.scss'
import cn from 'classnames'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ICartData } from '@/app/api/(routes)/cart/route'
import { DefaultLoader } from '@/shared/ui/Loaders'
import { Button } from '@/shared/ui/Button'
import { declOfNum } from '@/shared/lib/declOfNum'
import { CartDevice } from './CartDevice/CartDevice'
import { DeleteCartDeviceModal } from './DeleteCartDeviceModal/DeleteCartDeviceModal'
import { useIsLoading } from '@/shared/hooks/useIsLoading'
import { Skeleton } from '@/shared/ui/Skeleton'

interface ICartProps {
    children?: ReactNode
    className?: string
}

export const Cart: FC<ICartProps> = (props) => {
    const { className } = props

    const queryClient = useQueryClient()
    const [pageIsLoading, setPageIsLoading] = useIsLoading()

    const { data: cartData, isLoading, isFetching } = useQuery({
        queryKey: ['cart'],
        async queryFn() {
            const res = await fetch('/api/cart')
            const { data } = await res.json()

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) queryClient
                    .invalidateQueries({ queryKey: ['userData'] })
                throw new Error(data.message)
            }

            return data as ICartData
        },
        retry: false
    })
    // TV DELETE
    const { mutateAsync: deleteTv, isPending } = useMutation({
        retry: false,
        async mutationFn(cartDeviceId: string) {
            const res = await fetch('/api/cart', { method: 'DELETE', body: JSON.stringify({ cartDeviceId }) })
            const { data } = await res.json()

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) queryClient
                    .invalidateQueries({ queryKey: ['userData'] })
                queryClient.invalidateQueries({ queryKey: ['cart'] })
                throw new Error(data.message || 'Произошла ошибка при удалении телевизора из корзины')
            }
            queryClient.invalidateQueries({ queryKey: ['lightCart'] })
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
    })
    const [deletingCartDeviceId, setDeletingCartDeviceId] = useState<string | null>(null)
    const handleDeleteWindowBehavior = useCallback((cartDeviceId?: string) => {
        // Если null - то модалка закрывается, если id - открывается
        setDeletingCartDeviceId(cartDeviceId || null)
    }, [])

    // PATCH, update tv quantity
    const updateTvQuantity = useCallback(async (televisionId: string, newCount?: number) => {
        setPageIsLoading(true)
        const response = await fetch('/api/cart', {
            method: 'PATCH', body: JSON.stringify({
                televisionId, newCount
            })
        })
        if (response.status === 401 || response.status === 403) queryClient
            .invalidateQueries({ queryKey: ['userData'] })

        queryClient.invalidateQueries({ queryKey: ['cart'] })
        setPageIsLoading(false)
    }, [queryClient, setPageIsLoading])
    // Make order
    const {mutateAsync, isPending: isOrdering} = useMutation({
        async mutationFn(order: {
            orderPlacementSum: number, orderDevices: {quantity: number, televisionId: string}[]}
        ) {
            await fetch('/api/order', {method: 'POST', body: JSON.stringify(order)})
        }
    })

    if (isLoading) return <div className="container center"><DefaultLoader /></div>
    if (!cartData?.cart.cart_devices.length) return (
        <div className="container center">Пустая корзина получается</div>
    )

    
    const { cart: { cart_devices } } = cartData

    let goodsAmount = 0
    let goodsPrice = 0
    const cartDevices: JSX.Element[] = []
    for (const cartDevice of cart_devices) {
        const { quantity, id, television } = cartDevice
        if (television) {
            goodsAmount += quantity
            goodsPrice += quantity * parseFloat(television.price)
            //@ts-ignore 
            cartDevices.push(<CartDevice {...cartDevice} key={id}
                handleDelete={handleDeleteWindowBehavior} handleQuantityUpdate={updateTvQuantity} />)
        }
    }

    return (
        <div className={cn(className, styles.wrapper)}>
            <h1>Корзина</h1>
            <section className={styles.cart}>
                <ul className={cn(styles.goodsList)}>
                    {cartDevices}
                </ul>
                <div className={styles.orderBlock}>
                    <small>Итого:</small>
                    <div className={styles.orderInfo}>
                        {(isPending || isFetching || pageIsLoading)
                            ? (<Skeleton className={styles.skeleton} />)
                            : (<>
                                <strong className={styles.orderChar}>
                                    {declOfNum(goodsAmount, ['товар', "товара", "товаров"])}
                                </strong>
                                <strong className={styles.orderChar}>{goodsPrice}₽</strong>
                            </>)
                        }
                    </div>
                    <Button
                        className={styles.makeOrderBtn}
                        onClick={() => {
                            const order = {
                                orderPlacementSum: goodsPrice,
                                orderDevices: cart_devices.map(value => value.television?.id ? ({
                                    quantity: value.quantity,
                                    televisionId: value.television.id
                                }) : null).filter(Boolean) as {quantity: number, televisionId: string}[]
                            }
                            mutateAsync(order)
                        }}
                        disabled={isPending || isFetching || pageIsLoading || isOrdering}
                    >
                        Перейти к заказу
                    </Button>
                </div>
            </section>
            <DeleteCartDeviceModal
                cartDeviceId={deletingCartDeviceId} deleteCartDevice={deleteTv}
                onClose={() => handleDeleteWindowBehavior()}
            />
        </div>
    )
}