var ndarray = require('ndarray')

module.exports = function toNDArray (index) {
  var depth = index.depth
  var size = (1 << depth)

  var data = new Float32Array(size * size * size)
  var shape = [size, size, size]
  var stride = [size * size, size, 1]
  var result = ndarray(data, shape, stride, 0)

  var cells = index.tree.cells
  for (var i = 0; i < cells.length; ++i) {
    var cell = cells[i]
    var w = cell.w
    var l = cell.l

    var rshift = (30 - l)
    var x = cell.x >> rshift
    var y = cell.y >> rshift
    var z = cell.z >> rshift

    var shift = depth - l
    var r = (1 << shift)

    for (var a = 0; a < r; ++a) {
      for (var b = 0; b < r; ++b) {
        var ptr = ((z + a) << (2 * shift)) + ((y + b) << shift) + x
        for (var c = 0; c < r; ++c) {
          data[ptr + c] = w
        }
      }
    }
  }

  return result
}
