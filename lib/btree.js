var interleave = require('./interleave')

var B = 16

function BTreeNode (c0, c1, c2, children) {
  this.c0 = c0
  this.c1 = c1
  this.c2 = c2
  this.children = children
}

function BTree (root, cells) {
  this.root = root
  this.cells = cells
}

function createBTree (cells) {
  function buildTree (start, end) {
    if (end - start <= B) {
      return null
    }
    var step = Math.floor((end - start) / (B + 1))
    var c0 = new Array(B)
    var c1 = new Array(B)
    var c2 = new Array(B)
    var children = new Array(B + 1)
    for (var i = 0; i < B; ++i) {
      var x0 = start + step * i
      var x1 = start + step * (i + 1)
      var cell = cells[x1]
      c0[i] = cell.c0
      c1[i] = cell.c1
      c2[i] = cell.c2
      children[i] = buildTree(x0, x1)
    }
    children[B] = buildTree(start + step * B, end)
    return new BTreeNode(c0, c1, c2, children)
  }

  return new BTree(buildTree(0, cells.length), cells)
}

function clamp (v) {
  return Math.min(Math.max(v, 0), (1 << 30) - 1) | 0
}

function searchCell (tree, x_, y_, z_) {
  var x = clamp(x_)
  var y = clamp(y_)
  var z = clamp(z_)
  var c0 = interleave(x >> 20, y >> 20, z >> 20)
  var c1 = interleave(x >> 10, y >> 10, z >> 10)
  var c2 = interleave(x, y, z)

  var cells = tree.cells
  var start = 0
  var end = cells.length
  var node = tree.root

  while (node) {
    var i
    var step = Math.floor((end - start) / (B + 1)) | 0

    var nc0 = node.c0
    var nc1 = node.c1
    var nc2 = node.c2
    var nchild = node.children

    for (i = 0; i < B; ++i) {
      var d = (c0 - nc0) || (c1 - nc1) || (c2 - nc2)
      if (d < 0) {
        break
      }
    }

    end = Math.min(end, start + (i + 1) * step)
    start = start + i * step
    node = nchild[i]
  }

  for (var j = start; j < end; ++j) {
    var c = cells[j]
    var h = 1 << c.l
    if (c.x <= x && x < c.x + h &&
        c.y <= y && y < c.y + h &&
        c.z <= z && z < c.z + h) {
      return j
    }
  }

  // should never happen
  return 0
}

module.exports = {
  create: createBTree,
  search: searchCell
}
