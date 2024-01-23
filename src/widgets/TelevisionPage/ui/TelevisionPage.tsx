'use client'
import { FC, ReactNode } from 'react'
import styles from './TelevisionPage.module.scss'
import cn from 'classnames'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DefaultLoader } from '@/shared/ui/Loaders'
import { ITelevision } from '@/shared/types/Television'
import { IBrand } from '@/shared/types/Brand'
import Image from 'next/image'
import { Button } from '@/shared/ui/Button'
import { Description } from './Description/Description'
import { ScreenCharacteristics } from './ScreenCharacteristics/ScreenCharacteristics'
import { SoundCharacteristics } from './SoundCharacteristics/SoundCharacteristics'
import { TelevisionInterfaces } from './TelevisionInterfaces/TelevisionInterfaces'
import { MultimediaCharacteristics } from './MultimediaCharacteristics/MultimediaCharacteristics'
import { VolumeCharacteristics } from './VolumeCharacteristics/VolumeCharacteristics'
import { ExtraInformation } from './ExtraInformation/ExtraInformation'
import { useRouter } from 'next/navigation'
import { Role } from '@/shared/types/Role'

interface ITelevisionPageProps {
    children?: ReactNode
    className?: string
    televisionId: string
}

export const TelevisionPage: FC<ITelevisionPageProps> = (props) => {
    const { className, televisionId } = props

    const queryClient = useQueryClient()
    const { push } = useRouter()

    const { data } = useQuery<{ userData: { name?: string, email?: string, roles?: Role[] } }>({
        queryKey: ['userData']
    })
    const isAuth = !!(data?.userData?.name && data.userData.email)

    const { data: televisionData, isFetching, isLoading } = useQuery({
        queryKey: ['televisionDetails', televisionId],
        async queryFn() {
            const res = await fetch(`/api/televisions/${televisionId}`)
            const { data } = await res.json()

            return data.television as ITelevision & { brand: Pick<IBrand, 'id' | 'logoImg' | 'name'> }
        },
        retry: false
    })
    const { data: cartData, isLoading: isCartLoading } = useQuery({
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

    const { mutateAsync } = useMutation({
        async mutationFn(televisionId: string) {
            await fetch('/api/cart', { method: 'PATCH', body: JSON.stringify({ televisionId }) })
            queryClient.invalidateQueries({ queryKey: ['lightCart'] })
        }
    })

    if (isFetching || isLoading || isCartLoading) return (
        <div className='container center'><DefaultLoader /></div>
    )
    if (!televisionData) return (
        <div className='container center'><h2>Данного телевизора нет в нашем магазине</h2></div>
    )

    return (
        <section className={cn(className, styles.wrapper)}>
            <div className={styles.television}>
                <figure className={styles.figure}>
                    <Image
                        width={300} height={225}
                        src={televisionData.img}
                        alt={televisionData.name}
                    />
                    <figcaption>{televisionData.name}</figcaption>
                </figure>
                <p className={styles.price}>{televisionData.price}₽</p>
                <Button
                    color={cartData?.includes(televisionData.id) ? 'primary' : 'secondary'}
                    onClick={() => {
                        if (isAuth) {
                            cartData?.includes(televisionData.id) ? push('/cart') : mutateAsync(televisionId)
                        } else push('/login')
                    }}
                >
                    {cartData?.includes(televisionData.id) ? "Перейти в корзину" : "Добавить в корзину"}
                </Button>
            </div>
            <div className={styles.characteristics}>
                <h2 className={styles.mainTitle}>Характеристики</h2>
                <ul className={styles.characteristicsList}>
                    <Description description={televisionData.description} className={styles.listItem} />
                    <ScreenCharacteristics
                        className={styles.listItem}
                        diagonal={televisionData.diagonal}
                        hdResolution={televisionData.hdResolution}
                        resolution={televisionData.resolution}
                        hdrFormat={televisionData.hdrFormat}
                        screenType={televisionData.screenType}
                        tvFormat={televisionData.tvFormat}
                        illuminationType={televisionData.illuminationType}
                        matrix={televisionData.matrix}
                        screenTechnology={televisionData.screenTechnology}
                        brightness={televisionData.brightness}
                        contrast={televisionData.contrast}
                        dynamicContrast={televisionData.dynamicContrast}
                        viewAngle={televisionData.viewAngle}
                        pixelResponseTime={televisionData.pixelResponseTime}
                        screenRefreshRate={televisionData.screenRefreshRate}
                        dynamicSceneIdx={televisionData.dynamicSceneIdx}
                    />
                    <SoundCharacteristics
                        className={styles.listItem}
                        totalSoundPower={televisionData.totalSoundPower}
                        dynamicsCount={televisionData.dynamicsCount}
                    />
                    <TelevisionInterfaces
                        className={styles.listItem}
                        hdmiPorts={televisionData.hdmiPorts}
                        hdmiVersion={televisionData.hdmiVersion}
                        usbAmount={televisionData.usbAmount}
                        wirelessConnection={televisionData.wirelessConnection}
                        wifiStandard={televisionData.wifiStandard}
                    />
                    <MultimediaCharacteristics
                        className={styles.listItem}
                        supportSmartTv={televisionData.supportSmartTv}
                        tvTuner={televisionData.tvTuner}
                    />
                    <ExtraInformation
                        className={styles.listItem}
                        power={televisionData.power}
                        vesaFixingStandard={televisionData.vesaFixingStandard}
                        creationYear={televisionData.creationYear}
                    />
                    <VolumeCharacteristics
                        className={styles.listItem}
                        width={televisionData.width}
                        height={televisionData.height}
                        depth={televisionData.depth}
                        weight={televisionData.weight}
                    />
                </ul>
            </div>
        </section>
    )
}