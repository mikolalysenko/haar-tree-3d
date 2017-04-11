var search = require('./lib/btree.js').search

module.exports = function sampleTree (index, px, py, pz) {
  var bounds = index.bounds

  var lox = bounds[0][0]
  var loy = bounds[0][1]
  var loz = bounds[0][2]
  var hix = bounds[1][0]
  var hiy = bounds[1][1]
  var hiz = bounds[1][2]

  var ix = Math.round((1 << 30) * ((px - lox) / (hix - lox))) | 0
  var iy = Math.round((1 << 30) * ((py - loy) / (hiy - loy))) | 0
  var iz = Math.round((1 << 30) * ((pz - loz) / (hiz - loz))) | 0

  var cell = search(index.tree, ix, iy, iz)
  if (cell) {
    return cell.w
  }
  return 0
}
