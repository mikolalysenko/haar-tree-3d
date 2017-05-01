// THIS FILE IS GENERATED. DO NOT MODIFY
var search = require('./lib/btree.js').search

function Crossing (opp, idx) {
  this.opp = opp
  this.idx = idx
}

function findCrossing (positions, s, lox, loy, loz, a, b) {
  var adj = a.adj
  for (var i = 0; i < adj.length; ++i) {
    if (adj[i].opp === b) {
      return adj[i].idx
    }
  }

  // Add crossing record
  var idx = positions.length
  a.adj.push(new Crossing(b, idx))
  b.adj.push(new Crossing(a, idx))

  // compute crossing
  var aw = a.w
  var bw = b.w

  var t = -bw / (aw - bw)
  var ti = 1 - t

  positions.push([
    (ti * b.x + t * a.x) * s + lox,
    (ti * b.y + t * a.y) * s + loy,
    (ti * b.z + t * a.z) * s + loz
  ])

  return idx
}

function Corner (x, y, z, l) {
  this.x = x
  this.y = y
  this.z = z
  this.w = 0
  this.l = l
  this.adj = []
  this.steiner = []
}

function findCorner (corners, x, y, z) {
  var lo = 0
  var hi = corners.length - 1
  while (lo < hi) {
    var mid = (lo + hi) >> 1
    var c = corners[mid]
    var d = (c.x - x) || (c.y - y) || (c.z - z)
    if (d > 0) {
      hi = mid - 1
    } else if (d < 0) {
      lo = mid + 1
    } else {
      return c
    }
  }
  var cc = corners[lo]
  if (cc.x === x && cc.y === y && cc.z === z) {
    return cc
  }
  return null
}

function findEdgeSteiner (tree, c0, c1, level, H) {
  var x = (c0.x >> 1) + (c1.x >> 1)
  var y = (c0.y >> 1) + (c1.y >> 1)
  var z = (c0.z >> 1) + (c1.z >> 1)

  var steiner = c0.steiner
  for (var i = 0; i < steiner.length; ++i) {
    var ss = steiner[i]
    if (ss.x === x && ss.y === y && ss.z === z) {
      return ss
    }
  }

  var cc = new Corner(x, y, z, c0.l)
  cc.w = sampleFilter(tree, x, y, z, H) - level
  c0.steiner.push(cc)
  c1.steiner.push(cc)
  return cc
}

function genFaceSteiner (tree, a, b, c, d, f0, f1) {
  var x = Math.floor(0.25 * (a.x + b.x + c.x + d.x)) | 0
  var y = Math.floor(0.25 * (a.y + b.y + c.y + d.y)) | 0
  var z = Math.floor(0.25 * (a.z + b.z + c.z + d.z)) | 0

  var steiner = a.steiner
  for (var i = 0; i < steiner.length; ++i) {
    var ss = steiner[i]
    if (ss.x === x && ss.y === y && ss.z === z) {
      return ss
    }
  }

  var cc = new Corner(x, y, z, a.l)
  cc.w = 0.5 * (f0 + f1)
  a.steiner.push(cc)
  b.steiner.push(cc)
  c.steiner.push(cc)
  d.steiner.push(cc)
  return cc
}

function emitTetFaces (positions, cells, s, lox, loy, loz, a, b, c, d) {
  var e0, e1, e2, e3
  var aw = a.w < 0
  var bw = b.w < 0
  var cw = c.w < 0
  var dw = d.w < 0
  var mask = aw | (bw << 1) | (cw << 2) | (dw << 3)
  switch (mask) {
    case 0:
      break
    case 1:
      e0 = findCrossing(positions, s, lox, loy, loz, a, b)
      e1 = findCrossing(positions, s, lox, loy, loz, a, c)
      e2 = findCrossing(positions, s, lox, loy, loz, a, d)
      cells.push([e0, e1, e2])
      break
    case 2:
      e0 = findCrossing(positions, s, lox, loy, loz, a, b)
      e1 = findCrossing(positions, s, lox, loy, loz, b, c)
      e2 = findCrossing(positions, s, lox, loy, loz, b, d)
      cells.push([e1, e0, e2])
      break
    case 3:
      e0 = findCrossing(positions, s, lox, loy, loz, a, c)
      e1 = findCrossing(positions, s, lox, loy, loz, a, d)
      e2 = findCrossing(positions, s, lox, loy, loz, b, c)
      e3 = findCrossing(positions, s, lox, loy, loz, b, d)
      cells.push([e2, e0, e1])
      cells.push([e3, e2, e1])
      break
    case 4:
      e0 = findCrossing(positions, s, lox, loy, loz, a, c)
      e1 = findCrossing(positions, s, lox, loy, loz, b, c)
      e2 = findCrossing(positions, s, lox, loy, loz, c, d)
      cells.push([e0, e1, e2])
      break
    case 5:
      e0 = findCrossing(positions, s, lox, loy, loz, a, b)
      e1 = findCrossing(positions, s, lox, loy, loz, a, d)
      e2 = findCrossing(positions, s, lox, loy, loz, b, c)
      e3 = findCrossing(positions, s, lox, loy, loz, c, d)
      cells.push([e0, e2, e1])
      cells.push([e2, e3, e1])
      break
    case 6:
      e0 = findCrossing(positions, s, lox, loy, loz, a, b)
      e1 = findCrossing(positions, s, lox, loy, loz, a, c)
      e2 = findCrossing(positions, s, lox, loy, loz, b, d)
      e3 = findCrossing(positions, s, lox, loy, loz, c, d)
      cells.push([e1, e0, e2])
      cells.push([e3, e1, e2])
      break
    case 7:
      e0 = findCrossing(positions, s, lox, loy, loz, a, d)
      e1 = findCrossing(positions, s, lox, loy, loz, b, d)
      e2 = findCrossing(positions, s, lox, loy, loz, c, d)
      cells.push([e1, e2, e0])
      break
    case 8:
      e0 = findCrossing(positions, s, lox, loy, loz, a, d)
      e1 = findCrossing(positions, s, lox, loy, loz, b, d)
      e2 = findCrossing(positions, s, lox, loy, loz, c, d)
      cells.push([e1, e0, e2])
      break
    case 9:
      e0 = findCrossing(positions, s, lox, loy, loz, a, b)
      e1 = findCrossing(positions, s, lox, loy, loz, a, c)
      e2 = findCrossing(positions, s, lox, loy, loz, b, d)
      e3 = findCrossing(positions, s, lox, loy, loz, c, d)
      cells.push([e2, e0, e1])
      cells.push([e3, e2, e1])
      break
    case 10:
      e0 = findCrossing(positions, s, lox, loy, loz, a, b)
      e1 = findCrossing(positions, s, lox, loy, loz, a, d)
      e2 = findCrossing(positions, s, lox, loy, loz, b, c)
      e3 = findCrossing(positions, s, lox, loy, loz, c, d)
      cells.push([e0, e1, e2])
      cells.push([e1, e3, e2])
      break
    case 11:
      e0 = findCrossing(positions, s, lox, loy, loz, a, c)
      e1 = findCrossing(positions, s, lox, loy, loz, b, c)
      e2 = findCrossing(positions, s, lox, loy, loz, c, d)
      cells.push([e2, e1, e0])
      break
    case 12:
      e0 = findCrossing(positions, s, lox, loy, loz, a, c)
      e1 = findCrossing(positions, s, lox, loy, loz, a, d)
      e2 = findCrossing(positions, s, lox, loy, loz, b, c)
      e3 = findCrossing(positions, s, lox, loy, loz, b, d)
      cells.push([e1, e0, e2])
      cells.push([e3, e1, e2])
      break
    case 13:
      e0 = findCrossing(positions, s, lox, loy, loz, a, b)
      e1 = findCrossing(positions, s, lox, loy, loz, b, c)
      e2 = findCrossing(positions, s, lox, loy, loz, b, d)
      cells.push([e1, e2, e0])
      break
    case 14:
      e0 = findCrossing(positions, s, lox, loy, loz, a, b)
      e1 = findCrossing(positions, s, lox, loy, loz, a, c)
      e2 = findCrossing(positions, s, lox, loy, loz, a, d)
      cells.push([e2, e1, e0])
      break
    case 15:
      break
  }
}

function emitSteinerFaces (tree, positions, cells, s, lox, loy, loz, corners, a, b, y, c0, c1, dx, dy, dz, level, H) {
  var v = c0
  while (v !== c1) {
    var r = 1 << (30 - v.l)
    var u = null
    while (!u) {
      u = findCorner(corners, v.x + r * dx, v.y + r * dy, v.z + r * dz)
      r <<= 1
    }
    var ss = findEdgeSteiner(tree, u, v, level, H)
    emitTetFaces(positions, cells, s, lox, loy, loz, y, a, u, ss)
    emitTetFaces(positions, cells, s, lox, loy, loz, y, a, ss, v)
    emitTetFaces(positions, cells, s, lox, loy, loz, y, b, v, ss)
    emitTetFaces(positions, cells, s, lox, loy, loz, y, b, ss, u)
    v = u
  }
}

function emitTopology (index, corners, cellCorners, level) {
  var tree = index.tree
  var H = 1 << (30 - index.depth)

  var bounds = index.bounds
  var lo = bounds[0]
  var hi = bounds[1]

  var lox = lo[0]
  var loy = lo[1]
  var loz = lo[2]
  var s = (hi[0] - lox) / (1 << 30)

  var positions = []
  var cells = []

  var octreeCells = tree.cells
  for (var i = 0; i < octreeCells.length; ++i) {
    var cc = cellCorners[i]
    var c = octreeCells[i]

    var x = c.x
    var y = c.y
    var z = c.z
    var l = c.l
    var r = 1 << (30 - l)

    var nidx, ncell, ncorner, steiner

    var c000 = null
    var c100 = null
    var c010 = null
    var c110 = null
    var c001 = null
    var c101 = null
    var c011 = null
    var c111 = null

    nidx = search(tree, x - 1, y, z)
    ncell = octreeCells[nidx]
    if (ncell.l <= l && nidx !== i) {
      c000 = c000 || findCorner(corners, x, y, z)
      c010 = c010 || findCorner(corners, x, y + r, z)
      c001 = c001 || findCorner(corners, x, y, z + r)
      c011 = c011 || findCorner(corners, x, y + r, z + r)
      ncorner = cellCorners[nidx]
      steiner = genFaceSteiner(tree, c000, c010, c001, c011, ncorner.w, cc.w)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c000, c010, 0, 1, 0, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c010, c011, 0, 0, 1, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c011, c001, 0, -1, 0, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c001, c000, 0, 0, -1, level, H)
    }

    nidx = search(tree, x + r, y, z)
    ncell = octreeCells[nidx]
    if (ncell.l < l) {
      c100 = c100 || findCorner(corners, x + r, y, z)
      c101 = c101 || findCorner(corners, x + r, y, z + r)
      c110 = c110 || findCorner(corners, x + r, y + r, z)
      c111 = c111 || findCorner(corners, x + r, y + r, z + r)
      ncorner = cellCorners[nidx]
      steiner = genFaceSteiner(tree, c100, c101, c110, c111, ncorner.w, cc.w)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c100, c101, 0, 0, 1, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c101, c111, 0, 1, 0, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c111, c110, 0, 0, -1, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c110, c100, 0, -1, 0, level, H)
    }

    nidx = search(tree, x, y - 1, z)
    ncell = octreeCells[nidx]
    if (ncell.l <= l && nidx !== i) {
      c000 = c000 || findCorner(corners, x, y, z)
      c001 = c001 || findCorner(corners, x, y, z + r)
      c100 = c100 || findCorner(corners, x + r, y, z)
      c101 = c101 || findCorner(corners, x + r, y, z + r)
      ncorner = cellCorners[nidx]
      steiner = genFaceSteiner(tree, c000, c001, c100, c101, ncorner.w, cc.w)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c000, c001, 0, 0, 1, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c001, c101, 1, 0, 0, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c101, c100, 0, 0, -1, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c100, c000, -1, 0, 0, level, H)
    }

    nidx = search(tree, x, y + r, z)
    ncell = octreeCells[nidx]
    if (ncell.l < l) {
      c010 = c010 || findCorner(corners, x, y + r, z)
      c110 = c110 || findCorner(corners, x + r, y + r, z)
      c011 = c011 || findCorner(corners, x, y + r, z + r)
      c111 = c111 || findCorner(corners, x + r, y + r, z + r)
      ncorner = cellCorners[nidx]
      steiner = genFaceSteiner(tree, c010, c110, c011, c111, ncorner.w, cc.w)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c010, c110, 1, 0, 0, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c110, c111, 0, 0, 1, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c111, c011, -1, 0, 0, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c011, c010, 0, 0, -1, level, H)
    }

    nidx = search(tree, x, y, z - 1)
    ncell = octreeCells[nidx]
    if (ncell.l <= l && nidx !== i) {
      c000 = c000 || findCorner(corners, x, y, z)
      c100 = c100 || findCorner(corners, x + r, y, z)
      c010 = c010 || findCorner(corners, x, y + r, z)
      c110 = c110 || findCorner(corners, x + r, y + r, z)
      ncorner = cellCorners[nidx]
      steiner = genFaceSteiner(tree, c000, c100, c010, c110, ncorner.w, cc.w)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c000, c100, 1, 0, 0, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c100, c110, 0, 1, 0, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c110, c010, -1, 0, 0, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c010, c000, 0, -1, 0, level, H)
    }

    nidx = search(tree, x, y, z + r)
    ncell = octreeCells[nidx]
    if (ncell.l < l) {
      c001 = c001 || findCorner(corners, x, y, z + r)
      c011 = c011 || findCorner(corners, x, y + r, z + r)
      c101 = c101 || findCorner(corners, x + r, y, z + r)
      c111 = c111 || findCorner(corners, x + r, y + r, z + r)
      ncorner = cellCorners[nidx]
      steiner = genFaceSteiner(tree, c001, c011, c101, c111, ncorner.w, cc.w)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c001, c011, 0, 1, 0, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c011, c111, 1, 0, 0, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c111, c101, 0, -1, 0, level, H)
      emitSteinerFaces(tree, positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c101, c001, -1, 0, 0, level, H)
    }
  }

  return {
    positions: positions,
    cells: cells
  }
}

function sample (tree, x, y, z) {
  var w = 0
  for (var dx = 0; dx < 2; ++dx) {
    for (var dy = 0; dy < 2; ++dy) {
      for (var dz = 0; dz < 2; ++dz) {
        w += tree.cells[search(tree, x - dx, y - dy, z - dz)].w
      }
    }
  }
  return w / 8
}

function sampleFilter (tree, x, y, z, h) {
  return sample(tree, x, y, z)
}

function compareCorners (a, b) {
  return (a.x - b.x) || (a.y - b.y) || (a.z - b.z)
}

module.exports = function contourHaar (index, level_) {
  var level = (typeof level_ === 'number') ? +level_ : 0.5
  var i

  var tree = index.tree
  var octreeCells = tree.cells

  var H = 1 << (30 - index.depth)

  // 1st pass: generate corners and faces
  var cptr = 0
  var corners = new Array(octreeCells.length * 8)
  var cellCorners = new Array(octreeCells.length)
  for (i = 0; i < octreeCells.length; ++i) {
    var c = octreeCells[i]

    var x = c.x
    var y = c.y
    var z = c.z
    var l = c.l
    var r = 1 << (30 - l)

    corners[cptr++] = new Corner(x, y, z, l)
    corners[cptr++] = new Corner(x + r, y, z, l)
    corners[cptr++] = new Corner(x, y + r, z, l)
    corners[cptr++] = new Corner(x + r, y + r, z, l)
    corners[cptr++] = new Corner(x, y, z + r, l)
    corners[cptr++] = new Corner(x + r, y, z + r, l)
    corners[cptr++] = new Corner(x, y + r, z + r, l)
    corners[cptr++] = new Corner(x + r, y + r, z + r, l)

    var cc = new Corner(x + (r >> 1), y + (r >> 1), z + (r >> 1), l)
    cc.w = sampleFilter(tree, cc.x, cc.y, cc.z, H) - level
    cellCorners[i] = cc
  }

  // 2nd pass: sort corners
  corners.sort(compareCorners)

  // 3rd pass: compute weights for each corner
  var ptr = 0
  for (i = 0; i < corners.length; ++i) {
    var lmax = corners[i].l
    while (i + 1 < corners.length &&
      compareCorners(corners[i], corners[i + 1]) === 0) {
      lmax = Math.max(lmax, corners[++i].l)
    }
    var corner = corners[i]
    corners[ptr++] = corner
    corner.l = lmax
    corner.w = sampleFilter(tree, corner.x, corner.y, corner.z, H) - level
  }
  corners.length = ptr

  // final pass: emit topology
  return emitTopology(index, corners, cellCorners, level)
}

