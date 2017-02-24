const isInt = (v) => /^(\-|\+)?([1-9]+[0-9]*)$/.test(v)
const isFloat = (v) => v - parseFloat(v) + 1 >= 0

module.exports = (v) => {
  if (v === 'true' || v === 'TRUE') return true
  if (v === 'false' || v === 'FALSE') return false
  if (v === '') return undefined
  if (isInt(v)) return parseInt(v)
  if (isFloat(v)) return parseFloat(v)

  const d = Date.parse(v)
  if (!isNaN(d)) return d

  return v
}
