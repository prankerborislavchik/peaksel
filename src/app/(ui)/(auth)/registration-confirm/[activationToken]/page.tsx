import { RegistrationFinal } from "@/features/Auth"

interface IRegistrationConfirmProps {
    params: {
        activationToken: string
    }
}

export default function Page({ params: { activationToken } }: IRegistrationConfirmProps) {
    return (
        <RegistrationFinal activationToken={activationToken} />
    )
}