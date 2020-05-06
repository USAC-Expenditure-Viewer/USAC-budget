export function commaFormat(x) {
    if (Number.isNaN(x)) return ""
    x = Number.parseFloat(x).toFixed(2).toString()
    let parts = x.split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return parts.join(".");
}

export function KMFormat(x) {
    if (Number.isNaN(x)) return ""
    x = Number.parseFloat(x).toPrecision(3)
    let suffix = "";
    if (x >= 1000000) {
        suffix = "M"
        x /= 1000000;
    } else if (x >= 1000) {
        suffix = "K"
        x /= 1000;
    }
    return x.toString() + suffix;
}
