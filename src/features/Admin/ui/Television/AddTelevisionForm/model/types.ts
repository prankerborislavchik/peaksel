import { ITelevision } from "@/shared/types/Television"
import { DetailedHTMLProps, HTMLInputTypeAttribute, InputHTMLAttributes } from "react"
import { RegisterOptions } from "react-hook-form"
// import { TTelevision } from "../ui/AddTelevisionForm"

export type ValidationOptions = RegisterOptions

interface IDataInput {
    type: 'input'
    options?: ValidationOptions
    placeholder?: string
    inputType?: HTMLInputTypeAttribute | 'textarea'
    inputMode?: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>['inputMode']
}

interface IDataBoolean {
    type: 'true/false'
    trueValue: {
        title: string
    }
    falseValue: {
        title: string
    }
    options?: ValidationOptions
}

export interface IOption {
    value: string
    title: string
}

interface IDataOneOption {
    type: 'one-of-many'
    options: IOption[]
    visibleCount?: number
    validationOptions?: ValidationOptions
}

interface IDataManyOptions {
    type: 'many-options'
    options: IOption[]
    visibleCount?: number
    validationOptions?: ValidationOptions
}

interface IDataManufacturer {
    type: 'manufacturer'
    title: string
}

export type TVFeatureType = {
    name: keyof ITelevision 
    title: string
} & (IDataInput | IDataBoolean | IDataOneOption | IDataManyOptions | IDataManufacturer)