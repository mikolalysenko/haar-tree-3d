var search = require('./btree.js').search
var emitTopology = require('./topology.js')

function sampleNeighbor (tree, x, y, z) {
  var w = 0
  for (var dx = 0; dx < 2; ++dx) {
    for (var dy = 0; dy < 2; ++dy) {
      for (var dz = 0; dz < 2; ++dz) {
        w += tree.cells[search(tree, x - dx, y - dy, z - dz)].w
      }
    }
  }
  return w
}

function Corner (x, y, z) {
  this.x = x
  this.y = y
  this.z = z
  this.w = 0
  this.adj = null
}

function compareCorners (a, b) {
  return (a.x - b.x) || (a.y - b.y) || (a.z - b.z)
}

module.exports = function contourHaar (index, level_) {
  var level = (typeof level_ === 'number') ? +level_ : 0.5
  var i

  var tree = index.tree
  var octreeCells = tree.cells

  // 1st pass: generate corners and faces
  var corners = []
  var cellCorners = new Array(octreeCells.length)
  for (i = 0; i < octreeCells.length; ++i) {
    var c = octreeCells[i]

    var x = c.x
    var y = c.y
    var z = c.z
    var l = c.l
    var r = 1 << (30 - l)

    for (var dx = 0; dx < 2; ++dx) {
      for (var dy = 0; dy < 2; ++dy) {
        for (var dz = 0; dz < 2; ++dz) {
          corners.push(new Corner(x + dx * r, y + dy * r, z + dz * r))
        }
      }
    }
    var cellCorner = new Corner(x + (r >> 1), y + (r >> 1), z + (r >> 1))
    cellCorner.w = 8 * (c.w - level)
    cellCorner.adj = []
    cellCorners[i] = cellCorner
  }

  // 2nd pass: sort corners
  corners.sort(compareCorners)

  // 3rd pass: compute index for each corner
  var ptr = 0
  var level8 = 8 * level
  for (i = 0; i < corners.length; ++i) {
    while (i + 1 < corners.length &&
      compareCorners(corners[i], corners[i + 1]) === 0) {
      ++i
    }
    var corner = corners[i]
    corners[ptr++] = corner
    corner.w = sampleNeighbor(tree, corner.x, corner.y, corner.z) - level8
    corner.adj = []
  }
  corners.length = ptr

  // final pass emit topology
  return emitTopology(index, corners, cellCorners)
}
