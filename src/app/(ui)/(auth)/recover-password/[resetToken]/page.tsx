import {ResetPasswordForm} from '@/features/Auth'

export default function Page({params: {resetToken}}: {params: {resetToken: string}}) {
    return (
        <ResetPasswordForm resetToken={resetToken}/>
    )
}