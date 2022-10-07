export function shadeColor(color, percent) {

    const R = parseInt(color.substring(1, 3), 16);
    const G = parseInt(color.substring(3, 5), 16);
    const B = parseInt(color.substring(5, 7), 16);

    return [R, G, B]
        .map(x => Math.floor(x * (100 + percent) / 100))
        .map(x => Math.min(x, 255))
        .map(x => x.toString(16))
        .map(x => x.length === 1 ? "0" + x : x)
        .reduce((sum, x) => sum + x, '#')
}