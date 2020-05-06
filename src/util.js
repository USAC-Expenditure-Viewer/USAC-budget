"use strict";
exports.__esModule = true;
function commaFormat(x) {
    if (Number.isNaN(x))
        return "";
    var x_str = x.toFixed(2);
    var parts = x_str.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
exports.commaFormat = commaFormat;
function KMFormat(x) {
    if (Number.isNaN(x))
        return "";
    var suffix = "";
    if (x >= 1000000) {
        suffix = "M";
        x /= 1000000;
    }
    else if (x >= 1000) {
        suffix = "K";
        x /= 1000;
    }
    return x.toPrecision(3) + suffix;
}
exports.KMFormat = KMFormat;
