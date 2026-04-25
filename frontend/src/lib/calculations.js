export function calculateTiles({ ratePerSqft, tilesPerBox, totalArea }) {
  const rate = parseFloat(ratePerSqft) || 0
  const tpb  = parseFloat(tilesPerBox) || 0
  const area = parseFloat(totalArea)   || 0

  const totalBoxes  = tpb > 0 ? area / tpb : 0
  const pricePerBox = rate * tpb
  const grandTotal  = totalBoxes * pricePerBox

  return {
    totalBoxes:  parseFloat(totalBoxes.toFixed(4)),
    pricePerBox: parseFloat(pricePerBox.toFixed(2)),
    grandTotal:  parseFloat(grandTotal.toFixed(2)),
  }
}