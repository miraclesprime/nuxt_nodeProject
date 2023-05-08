/*export function hex2rgba(hex = ColorVariants.Light, alpha = .16) {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  console.log(r, g, b)
  return `rgba(${r},${g},${b},${alpha})`;
}*/

export default ({ store }, inject) => {
  inject('hex2rgba', (hex = '#d35230', colors, alpha = 0.16) => {
    // console.log(colors.ColorVariants)
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
        // console.log(hex1, alpha)
        const [r, g, b] = hex1.match(/\w\w/g).map(x => parseInt(x, 16));
        return `rgba(${r},${g},${b},${alpha})`;
    } else {
        const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
        // console.log(r, g, b)
        return `rgba(${r},${g},${b},${alpha})`;
    }
  })
}
