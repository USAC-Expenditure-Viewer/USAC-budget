export function commaFormat(x: number): string {
    if (Number.isNaN(x)) return ""
    let x_str: string = x.toFixed(2)
    let parts: string[] = x_str.split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return parts.join(".");
}

export function KMFormat(x: number): string {
    if (Number.isNaN(x)) return ""
    let suffix = "";
    if (Math.abs(x) >= 1000000000) {
        suffix = "B"
        x /= 1000000000;
    } else if (Math.abs(x) >= 1000000) {
        suffix = "M"
        x /= 1000000;
    } else if (Math.abs(x) >= 1000) {
        suffix = "K"
        x /= 1000;
    }
    return x.toPrecision(3) + suffix;
}

export function KMFToNum(str: string): number {
    let unit = 1
    if (str.includes('K')) {
        unit = 1000
        str = str.replace('K', '')
    }
    if (str.includes('M')) {
        unit = 1000000
        str = str.replace('M', '')
    }
    if (str.includes('B')) {
        str = str.replace('B', '')
        unit = 1000000000
    }
    return Number.parseFloat(str) * unit
}
