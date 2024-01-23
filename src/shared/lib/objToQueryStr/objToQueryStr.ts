export function objToQueryStr(data?: Record<string, any> | null) {
    if (!data) return ''
    let queryString = '';
    for (const [key, value] of Object.entries(data)) {
        if (!value && value !== 0) continue
        if (Array.isArray(value)) {
            if (!value.length) continue
            queryString += '&' + value.map(
                val => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
            ).join('&')
        } else {
            queryString += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        }
    }
    return queryString.replace('&', '?')
}