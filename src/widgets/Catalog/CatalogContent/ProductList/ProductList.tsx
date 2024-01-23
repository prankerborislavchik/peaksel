'use client'
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import styles from './ProductList.module.scss'
import CheckIcon from '@/shared/assets/check-icon.svg'
import cn from 'classnames'
import { Button } from '@/shared/ui/Button'
import Image from 'next/image'
import CartIcon from '@/shared/assets/cart-icon.svg'
import { ProductListWrapper } from './ProductListWrapper'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { DefaultLoader } from '@/shared/ui/Loaders'
import { useIsLoading } from '@/shared/hooks/useIsLoading'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { Role } from '@/shared/types/Role'

interface IProductListProps {
    children?: ReactNode
    className?: string
}

interface ITelevisionsData {
    data: {
        totalCount: number,
        televisions: ({ id: string, img: string, name: string, price: string })[]
        offset: number
        pageSize: number
        page: number
    }
}

export const ProductList: FC<IProductListProps> = (props) => {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { push } = useRouter()

    const [televisions, setTelevisions] = useState<ITelevisionsData['data']['televisions']>(() => [])
    const [isLoading, setIsLoading] = useIsLoading()

    const pagesAmount = useRef<number>(0)
    const page = useRef<number>(0)

    const { data } = useQuery<{ userData: { name?: string, email?: string, roles?: Role[] } }>({
        queryKey: ['userData']
    })
    const isAuth = !!(data?.userData?.name && data.userData.email)
    // console.log(data.userData)

    const { data: cartTelevisions } = useQuery({
        queryKey: ['lightCart'],
        async queryFn() {
            const res = await fetch('/api/cart?idOnly')
            const { data } = await res.json()
            if (!Array.isArray(data?.cart?.cart_devices)) throw new Error(data.message)

            return data.cart.cart_devices
                .filter(({ television }: { id: string; television: { id: string } | null }) => !!television)
                .map(({ television: { id } }: { television: { id: string } }) => id) as string[]
        },
        retry: false,
    })
    // Там useQuery а тут useEffect, потому что useQuery как-то криво при смене searchParams работает, мб из-за кеша, хз
    useEffect(() => {
        setIsLoading(true)
        fetch(`/api/televisions?${searchParams.toString()}`).then(res => res.json())
            .then(({ data: {
                totalCount, page: currentPage, pageSize, televisions }
            }: ITelevisionsData) => {
                setTelevisions(televisions || [])
                setIsLoading(false)
                pagesAmount.current = Math.ceil(totalCount / pageSize)
                page.current = currentPage
            })
    }, [searchParams, pathname, setIsLoading])

    const handlePageChange = useCallback((newPage: number) => {
        const urlSearchParams = new URLSearchParams(searchParams)
        urlSearchParams.set('page', `${newPage}`)
        push(`${pathname}?${urlSearchParams}`)
    }, [pathname, push, searchParams])

    const queryClient = useQueryClient()

    const { mutateAsync } = useMutation({
        async mutationFn(televisionId: string) {
            await fetch('/api/cart', { method: 'PATCH', body: JSON.stringify({ televisionId }) })
            queryClient.invalidateQueries({ queryKey: ['lightCart'] })
        }
    })


    if (isLoading) return (
        <ProductListWrapper className={cn(styles.notFound)} handlePageChange={handlePageChange}>
            <div className={cn('container center')}><DefaultLoader /></div>
        </ProductListWrapper>
    )

    return (
        <ProductListWrapper className={cn(!televisions.length && styles.notFound)}
            handlePageChange={handlePageChange}
            pagesAmount={pagesAmount.current} currentPage={page.current}>
            {
                televisions.length ? (
                    televisions.map(({ id, img, name, price }) => (
                        <li key={id} className={cn(styles.card)}>
                            <Link href={`/shop/${id}`} className={styles.picWrapper}>
                                <picture>
                                    <Image src={img} alt={name} width={160} height={120}
                                        className={styles.bigImg} />
                                    <Image src={img} alt={name} width={120} height={90}
                                        className={styles.smallImg} />
                                </picture>
                            </Link>

                            <div className={styles.info}>
                                <div className={styles.infWRate}>
                                    <div className={cn(styles.designation)}>
                                        <Link href={`/shop/${id}`}>
                                            <small>Телевизор</small>
                                            <strong className={cn(styles.productName)}>{name}</strong>
                                        </Link>
                                    </div>
                                </div>
                                <div className={styles.cardBottom}>
                                    <strong className={styles.price}>
                                        {`${price}`.includes('₽') ? price : price + '₽'}
                                    </strong>
                                    <Button className={styles.widenBtn}
                                        color={cartTelevisions?.includes(id) ? 'primary' : 'secondary'}
                                        onClick={() => {
                                            if (isAuth) {
                                                cartTelevisions?.includes(id)
                                                    ? push('/cart') : mutateAsync(id)
                                            } else push('/login')
                                        }}
                                    >
                                        {cartTelevisions?.includes(id)
                                            ? "Уже в корзине"
                                            : "Добавить в корзину"
                                        }
                                    </Button>
                                    <Button className={styles.collapsedBtn}
                                        color={cartTelevisions?.includes(id) ? 'primary' : 'secondary'}
                                        onClick={() => {
                                            if (isAuth) {
                                                cartTelevisions?.includes(id)
                                                    ? push('/cart') : mutateAsync(id)
                                            } else push('/login')
                                        }}
                                    >
                                        {cartTelevisions?.includes(id)
                                            ? <CheckIcon className={styles.inCartIcon} />
                                            : <CartIcon />
                                        }
                                    </Button>
                                </div>
                            </div>
                        </li>
                    ))
                ) : <div className={cn('container center')}>Результатов не найдено</div>
            }
        </ProductListWrapper>
    )
}
