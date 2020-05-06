export function commaFormat(x: number) : string {
    if (Number.isNaN(x)) return ""
    let x_str: string = x.toFixed(2)
    let parts: string[] = x_str.split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return parts.join(".");
}

export function KMFormat(x: number) : string {
    if (Number.isNaN(x)) return ""
    let suffix = "";
    if (x >= 1000000) {
        suffix = "M"
        x /= 1000000;
    } else if (x >= 1000) {
        suffix = "K"
        x /= 1000;
    }
    return x.toPrecision(3) + suffix;
}
