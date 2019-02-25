export const quchong = (arr: [], key: string) => {
    let hash: any = {}
    return arr.reduce((item: any, next: any) => {
        hash[next[key]] ? '' : hash[next[key]] = true && item.push(next);
        return item
    }, [])
}
