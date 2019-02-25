export const getUpCaseName = (source: string, split: string = '-') => {
    source = source.replace('-controller', '')
    let array = source.split(split)
    return array.map(m => m.substr(0, 1).toUpperCase() + m.substr(1)).join('')
}
