import { FC, ReactNode } from 'react'
// import styles from './Portal.module.scss'
// import cn from 'classnames'
import { createPortal } from 'react-dom'

interface IPortalProps {
    children?: ReactNode
    className?: string
    container?: Element | DocumentFragment
}

export const Portal: FC<IPortalProps> = (props) => {

    if (typeof window !== 'undefined') {

        const {
            children,
            container = document.body
        } = props

        return (
            createPortal(
                <>
                    {children}
                </>
                , container
            )
    
        )
    }

    return (
        <>
            {props.children}
        </>
    )

}