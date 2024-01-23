'use client'
import Link from 'next/link'
import './(ui)/styles/not-found.scss'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
// import styles from './(ui)/styles/not-found.module.scss'


export default function ErrorComponent() {

    const router = useRouter()
    useEffect(() => {
        document.body.classList.add("not-found")

        return () => {
            document.body.classList.remove('not-found')
        }
    }, [])

    return (
        <>
            <div className="noise"></div>
            <div className="overlay"></div>
            <div className='not-found-wrapper container'>
                <div className="terminal">
                    <h1>Ошибка <span className="errorcode">404</span></h1>
                    <p className="output">
                        СТРАНИЦА, КОТОРУЮ ВЫ ИЩЕТЕ, 
                        МОГЛА БЫТЬ УДАЛЕНА, ИЗМЕНИТЬ НАЗВАНИЕ ИЛИ ВРЕМЕННО НЕДОСТУПНА.
                    </p>
                    <p className="output">
                        Пожалуйста, попробуйте
                        <Link 
                            href={'/'} 
                            className='terminal-link' 
                            onClick={router.back}>вернуться обратно</Link> или
                        <Link className='terminal-link' href='/'>вернуться на главную</Link>.
                    </p>
                    <p className="output">Удачи.</p>
                </div>
            </div>
        </>
    )
}