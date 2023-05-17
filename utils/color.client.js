
export default ({ store }, inject) => {
  inject('hex2rgba', (hex = '#d35230', colors, alpha = 0.16) => {
    if (hex[0] != '#') {
        if (!colors) {
            console.warn('No colors to match from')
            return ""
        }
        const variants = colors.ColorVariants
        let hex1
        for (const [key, value] of Object.entries(variants)) {
            if (key.toLowerCase() == hex.toLowerCase()){
                hex1 = value
            }
        }
        const [r, g, b] = hex1.match(/\w\w/g).map(x => parseInt(x, 16));
        return `rgba(${r},${g},${b},${alpha})`;
    } else {
        const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
        return `rgba(${r},${g},${b},${alpha})`;
    }
  })
}
