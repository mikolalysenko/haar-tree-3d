var interleave = require('./interleave')

function OctreeCell (w, x_, y_, z_, l) {
  var lshift = 30 - l
  var x = this.x = x_ << lshift
  var y = this.y = y_ << lshift
  var z = this.z = z_ << lshift
  this.c0 = interleave(x >> 20, y >> 20, z >> 20)
  this.c1 = interleave(x >> 10, y >> 10, z >> 10)
  this.c2 = interleave(x, y, z)
  this.w = w
  this.l = l
}

var BOXES = []

function visit (node, w, x, y, z, l) {
  if (!node) {
    BOXES.push(new OctreeCell(w, x, y, z, l))
    return
  }

  var coeffs = node.coeffs
  var c0 = coeffs[0]
  var c1 = coeffs[1]
  var c2 = coeffs[2]
  var c3 = coeffs[3]
  var c4 = coeffs[4]
  var c5 = coeffs[5]
  var c6 = coeffs[6]

  var child = node.children
  var sx = x << 1
  var sy = y << 1
  var sz = z << 1
  var ptr = 0
  for (var dz = 0; dz < 2; ++dz) {
    for (var dy = 0; dy < 2; ++dy) {
      for (var dx = 0; dx < 2; ++dx, ++ptr) {
        var hx = 1 - 2 * dx
        var hy = 1 - 2 * dy
        var hz = 1 - 2 * dz

        var v =
          hx * c0 +
          hy * c1 +
          hx * hy * c2 +
          hz * c3 +
          hx * hz * c4 +
          hy * hz * c5 +
          hx * hy * hz * c6

        visit(child[ptr], w + v, sx + dx, sy + dy, sz + dz, l + 1)
      }
    }
  }
}

function flattenOctree (tree) {
  visit(tree.root, tree.coeff, 0, 0, 0, 0)
  var result = BOXES.slice()
  BOXES.length = 0
  return result
}

module.exports = flattenOctree
