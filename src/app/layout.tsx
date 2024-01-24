import './(ui)/styles/index.scss'
import '@/app/styles.css'
import type { Metadata } from 'next'
import { 
    JetBrains_Mono, 
    // Roboto_Mono 
} from 'next/font/google'
import { ReactNode } from 'react'
import { DefaultLayout } from './(ui)/Layouts/Default'
import { ThemeProvider } from './(ui)/Providers/ThemeProvider'
import { QueryProvider } from './(ui)/Providers/QueryProvider'

const jetBrainsMono = JetBrains_Mono(
    {
        subsets: ['latin', 'cyrillic'],
        variable: '--font-family',
        display: 'auto',
        // weight: '400'
        weight: ['100', '400', '700']
    }
)

// const ibmPlexMono = Roboto_Mono(
//     {
//         weight: ['100', '400', '700'],
//         display: 'block',
//         variable: '--font-family',
//         subsets: ['latin', 'cyrillic']
//     }    
// )

export const metadata: Metadata = {
    title: 'Peaksel',
    description: 'Лучший продавец телевизоров',

}

export default function RootLayout({ children }: { children: ReactNode }) {

    return (
        <html lang="en">
            <body className={`${jetBrainsMono.className} ${jetBrainsMono.variable}`}>
                <QueryProvider>
                    <ThemeProvider>
                        <DefaultLayout>
                            {children}
                        </DefaultLayout>
                    </ThemeProvider>
                </QueryProvider>
            </body>
        </html>
    )
}
