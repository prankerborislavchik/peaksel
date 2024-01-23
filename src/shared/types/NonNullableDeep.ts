export type NonNullableDeep<T extends object> = {
    [K in keyof T]-?: T[K] extends object ? NonNullableDeep<T[K]> : Exclude<T[K], null> 
}