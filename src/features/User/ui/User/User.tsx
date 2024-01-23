import { Profile } from "../Profile/Profile";
import { FC, ReactNode } from 'react'
// import styles from './User.module.scss'
// import cn from 'classnames'
import { ThemeSwitcher } from "../ThemeSwitcher/ThemeSwitcher";

interface IUserProps {
    children?: ReactNode
    className?: string
}

export const User: FC<IUserProps> = (props) => {
    const { className } = props

    return (
        <Profile className={className}>
            <ThemeSwitcher/>
        </Profile>
    )
}
