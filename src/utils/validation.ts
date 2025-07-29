//
//
//
const is_valid_path = (allow_undefined: boolean, path?: string): boolean => {
    if (allow_undefined === true && path === undefined) return true

    return typeof path === 'string' && path.startsWith('/') && path.trim().length > 1
}

//
//
//
const is_valid_name = (name?: string): boolean => {
    return typeof name === 'string' &&
        !name.startsWith('/') &&
        name.indexOf('/') == -1 &&
        name.trim().length > 0
}

//
//
//
export const Validation = {
    is_valid_name,
    is_valid_path,
}
