//
//
//
export const is_valid_Path = (path?: string): boolean => {
    if (path === undefined) return false

    return typeof path === 'string' &&
        path.startsWith('/') &&
        path.length > 1
}
