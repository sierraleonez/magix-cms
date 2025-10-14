export function capitalizeFirstLetter(str: string) {
    if (!str || typeof str !== 'string') return ''
    const capitalizedFirstLetter = str[0].toUpperCase();
    const substring = str.substring(1)

    return capitalizedFirstLetter + substring
}

export function replaceUnderscoreWithSpace(str: string) {
    if (!str || typeof str !== 'string') return ''
    return str.replaceAll('_', ' ')
}

export function replaceUnderscoreAndCapitalizeFirstLetter(str: string) {
    if (!str || typeof str !== 'string') return ''

    const words = str.split('_')
    const word = words.reduce((prev, current) => {
        const capitalizedFirstLetter = capitalizeFirstLetter(current)
        if (prev === "") return capitalizedFirstLetter
        return prev + capitalizedFirstLetter
    }, "")

    return word
}