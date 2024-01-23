import { Role } from "./Role"

export interface IUser {
    id: string
    email: string 
    phoneNumber: string | null
    roles: Role[]
    password: string
    name: string
    latestPasswordChangeDate: Date
    resetToken: string | null
    resetTokenExp: Date | null
    activationToken: string | null
    isActivated: boolean
}