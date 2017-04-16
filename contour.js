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

function emitPyramidFaces (positions, cells, s, lox, loy, loz, a, c00, c01, c10, c11) {
  var e0, e1, e2, e3, e4, e5
  var wa = a.w < 0
  var w00 = c00.w < 0
  var w01 = c01.w < 0
  var w10 = c10.w < 0
  var w11 = c11.w < 0
  var mask = wa | (w00 << 1) | (w01 << 2) | (w10 << 3) | (w11 << 4)
  switch (mask) {
    case 0:
    break;
    case 1:
      e0 = findCrossing(positions, s, lox, loy, loz, c00, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c01, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c10, a)
      e3 = findCrossing(positions, s, lox, loy, loz, c11, a)
      cells.push([e0, e1, e2])
      cells.push([e1, e3, e2])
    break;
    case 2:
      e0 = findCrossing(positions, s, lox, loy, loz, c00, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c00, c01)
      e2 = findCrossing(positions, s, lox, loy, loz, c00, c10)
      cells.push([e1, e0, e2])
    break;
    case 3:
      e0 = findCrossing(positions, s, lox, loy, loz, c01, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c10, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c11, a)
      e3 = findCrossing(positions, s, lox, loy, loz, c00, c01)
      e4 = findCrossing(positions, s, lox, loy, loz, c00, c10)
      cells.push([e0, e2, e3])
      cells.push([e2, e4, e3])
      cells.push([e4, e2, e1])
    break;
    case 4:
      e0 = findCrossing(positions, s, lox, loy, loz, c01, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c00, c01)
      e2 = findCrossing(positions, s, lox, loy, loz, c01, c11)
      cells.push([e0, e1, e2])
    break;
    case 5:
      e0 = findCrossing(positions, s, lox, loy, loz, c00, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c10, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c11, a)
      e3 = findCrossing(positions, s, lox, loy, loz, c00, c01)
      e4 = findCrossing(positions, s, lox, loy, loz, c01, c11)
      cells.push([e0, e3, e1])
      cells.push([e4, e2, e1])
      cells.push([e3, e4, e1])
    break;
    case 6:
      e0 = findCrossing(positions, s, lox, loy, loz, c00, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c01, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c00, c10)
      e3 = findCrossing(positions, s, lox, loy, loz, c01, c11)
      cells.push([e1, e0, e2])
      cells.push([e3, e1, e2])
    break;
    case 7:
      e0 = findCrossing(positions, s, lox, loy, loz, c10, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c11, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c00, c10)
      e3 = findCrossing(positions, s, lox, loy, loz, c01, c11)
      cells.push([e2, e1, e0])
      cells.push([e1, e2, e3])
    break;
    case 8:
      e0 = findCrossing(positions, s, lox, loy, loz, c10, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c00, c10)
      e2 = findCrossing(positions, s, lox, loy, loz, c10, c11)
      cells.push([e1, e0, e2])
    break;
    case 9:
      e0 = findCrossing(positions, s, lox, loy, loz, c00, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c01, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c11, a)
      e3 = findCrossing(positions, s, lox, loy, loz, c00, c10)
      e4 = findCrossing(positions, s, lox, loy, loz, c10, c11)
      cells.push([e3, e0, e1])
      cells.push([e4, e3, e1])
      cells.push([e2, e4, e1])
    break;
    case 10:
      e0 = findCrossing(positions, s, lox, loy, loz, c00, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c10, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c00, c01)
      e3 = findCrossing(positions, s, lox, loy, loz, c10, c11)
      cells.push([e0, e1, e2])
      cells.push([e1, e3, e2])
    break;
    case 11:
      e0 = findCrossing(positions, s, lox, loy, loz, c01, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c11, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c00, c01)
      e3 = findCrossing(positions, s, lox, loy, loz, c10, c11)
      cells.push([e1, e2, e0])
      cells.push([e2, e1, e3])
    break;
    case 12:
      e0 = findCrossing(positions, s, lox, loy, loz, c01, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c10, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c00, c01)
      e3 = findCrossing(positions, s, lox, loy, loz, c00, c10)
      e4 = findCrossing(positions, s, lox, loy, loz, c01, c11)
      e5 = findCrossing(positions, s, lox, loy, loz, c10, c11)
      cells.push([e1, e0, e2])
      cells.push([e3, e1, e2])
      cells.push([e0, e1, e4])
      cells.push([e1, e5, e4])
    break;
    case 13:
      e0 = findCrossing(positions, s, lox, loy, loz, c00, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c11, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c00, c01)
      e3 = findCrossing(positions, s, lox, loy, loz, c00, c10)
      e4 = findCrossing(positions, s, lox, loy, loz, c01, c11)
      e5 = findCrossing(positions, s, lox, loy, loz, c10, c11)
      cells.push([e2, e3, e0])
      cells.push([e5, e4, e1])
    break;
    case 14:
      e0 = findCrossing(positions, s, lox, loy, loz, c00, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c01, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c10, a)
      e3 = findCrossing(positions, s, lox, loy, loz, c01, c11)
      e4 = findCrossing(positions, s, lox, loy, loz, c10, c11)
      cells.push([e2, e1, e0])
      cells.push([e1, e2, e3])
      cells.push([e2, e4, e3])
    break;
    case 15:
      e0 = findCrossing(positions, s, lox, loy, loz, c11, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c01, c11)
      e2 = findCrossing(positions, s, lox, loy, loz, c10, c11)
      cells.push([e1, e0, e2])
    break;
    case 16:
      e0 = findCrossing(positions, s, lox, loy, loz, c11, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c01, c11)
      e2 = findCrossing(positions, s, lox, loy, loz, c10, c11)
      cells.push([e0, e1, e2])
    break;
    case 17:
      e0 = findCrossing(positions, s, lox, loy, loz, c00, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c01, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c10, a)
      e3 = findCrossing(positions, s, lox, loy, loz, c01, c11)
      e4 = findCrossing(positions, s, lox, loy, loz, c10, c11)
      cells.push([e3, e0, e1])
      cells.push([e0, e4, e2])
      cells.push([e0, e3, e4])
    break;
    case 18:
      e0 = findCrossing(positions, s, lox, loy, loz, c00, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c11, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c00, c01)
      e3 = findCrossing(positions, s, lox, loy, loz, c00, c10)
      e4 = findCrossing(positions, s, lox, loy, loz, c01, c11)
      e5 = findCrossing(positions, s, lox, loy, loz, c10, c11)
      cells.push([e0, e1, e2])
      cells.push([e1, e0, e3])
      cells.push([e1, e4, e2])
      cells.push([e5, e1, e3])
    break;
    case 19:
      e0 = findCrossing(positions, s, lox, loy, loz, c01, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c10, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c00, c01)
      e3 = findCrossing(positions, s, lox, loy, loz, c00, c10)
      e4 = findCrossing(positions, s, lox, loy, loz, c01, c11)
      e5 = findCrossing(positions, s, lox, loy, loz, c10, c11)
      cells.push([e4, e2, e0])
      cells.push([e3, e5, e1])
    break;
    case 20:
      e0 = findCrossing(positions, s, lox, loy, loz, c01, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c11, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c00, c01)
      e3 = findCrossing(positions, s, lox, loy, loz, c10, c11)
      cells.push([e1, e0, e2])
      cells.push([e3, e1, e2])
    break;
    case 21:
      e0 = findCrossing(positions, s, lox, loy, loz, c00, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c10, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c00, c01)
      e3 = findCrossing(positions, s, lox, loy, loz, c10, c11)
      cells.push([e2, e1, e0])
      cells.push([e1, e2, e3])
    break;
    case 22:
      e0 = findCrossing(positions, s, lox, loy, loz, c00, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c01, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c11, a)
      e3 = findCrossing(positions, s, lox, loy, loz, c00, c10)
      e4 = findCrossing(positions, s, lox, loy, loz, c10, c11)
      cells.push([e2, e1, e0])
      cells.push([e3, e2, e0])
      cells.push([e2, e3, e4])
    break;
    case 23:
      e0 = findCrossing(positions, s, lox, loy, loz, c10, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c00, c10)
      e2 = findCrossing(positions, s, lox, loy, loz, c10, c11)
      cells.push([e1, e2, e0])
    break;
    case 24:
      e0 = findCrossing(positions, s, lox, loy, loz, c10, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c11, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c00, c10)
      e3 = findCrossing(positions, s, lox, loy, loz, c01, c11)
      cells.push([e0, e1, e2])
      cells.push([e1, e3, e2])
    break;
    case 25:
      e0 = findCrossing(positions, s, lox, loy, loz, c00, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c01, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c00, c10)
      e3 = findCrossing(positions, s, lox, loy, loz, c01, c11)
      cells.push([e1, e2, e0])
      cells.push([e2, e1, e3])
    break;
    case 26:
      e0 = findCrossing(positions, s, lox, loy, loz, c00, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c10, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c11, a)
      e3 = findCrossing(positions, s, lox, loy, loz, c00, c01)
      e4 = findCrossing(positions, s, lox, loy, loz, c01, c11)
      cells.push([e1, e2, e0])
      cells.push([e2, e3, e0])
      cells.push([e3, e2, e4])
    break;
    case 27:
      e0 = findCrossing(positions, s, lox, loy, loz, c01, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c00, c01)
      e2 = findCrossing(positions, s, lox, loy, loz, c01, c11)
      cells.push([e2, e1, e0])
    break;
    case 28:
      e0 = findCrossing(positions, s, lox, loy, loz, c01, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c10, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c11, a)
      e3 = findCrossing(positions, s, lox, loy, loz, c00, c01)
      e4 = findCrossing(positions, s, lox, loy, loz, c00, c10)
      cells.push([e1, e2, e0])
      cells.push([e3, e1, e0])
      cells.push([e1, e3, e4])
    break;
    case 29:
      e0 = findCrossing(positions, s, lox, loy, loz, c00, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c00, c01)
      e2 = findCrossing(positions, s, lox, loy, loz, c00, c10)
      cells.push([e1, e2, e0])
    break;
    case 30:
      e0 = findCrossing(positions, s, lox, loy, loz, c00, a)
      e1 = findCrossing(positions, s, lox, loy, loz, c01, a)
      e2 = findCrossing(positions, s, lox, loy, loz, c10, a)
      e3 = findCrossing(positions, s, lox, loy, loz, c11, a)
      cells.push([e2, e1, e0])
      cells.push([e1, e2, e3])
    break;
    case 31:
    break;
  }
}

function Corner (x, y, z, l) {
  this.x = x
  this.y = y
  this.z = z
  this.w = 0
  this.l = l
  this.adj = null
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

function genSteiner (a, b, c, d) {
  var r = new Corner(
    (a.x + b.x + c.x + d.x) >> 2,
    (a.y + b.y + c.y + d.y) >> 2,
    (a.z + b.z + c.z + d.z) >> 2,
    Math.max(a.l, b.l, c.l, d.l))
  r.w = (a.w + b.w + c.w + d.w) / 4
  r.adj = []
  return r
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
    break;
    case 1:
      e0 = findCrossing(positions, s, lox, loy, loz, a, b)
      e1 = findCrossing(positions, s, lox, loy, loz, a, c)
      e2 = findCrossing(positions, s, lox, loy, loz, a, d)
      cells.push([e0, e1, e2])
    break;
    case 2:
      e0 = findCrossing(positions, s, lox, loy, loz, a, b)
      e1 = findCrossing(positions, s, lox, loy, loz, b, c)
      e2 = findCrossing(positions, s, lox, loy, loz, b, d)
      cells.push([e1, e0, e2])
    break;
    case 3:
      e0 = findCrossing(positions, s, lox, loy, loz, a, c)
      e1 = findCrossing(positions, s, lox, loy, loz, a, d)
      e2 = findCrossing(positions, s, lox, loy, loz, b, c)
      e3 = findCrossing(positions, s, lox, loy, loz, b, d)
      cells.push([e2, e0, e1])
      cells.push([e3, e2, e1])
    break;
    case 4:
      e0 = findCrossing(positions, s, lox, loy, loz, a, c)
      e1 = findCrossing(positions, s, lox, loy, loz, b, c)
      e2 = findCrossing(positions, s, lox, loy, loz, c, d)
      cells.push([e0, e1, e2])
    break;
    case 5:
      e0 = findCrossing(positions, s, lox, loy, loz, a, b)
      e1 = findCrossing(positions, s, lox, loy, loz, a, d)
      e2 = findCrossing(positions, s, lox, loy, loz, b, c)
      e3 = findCrossing(positions, s, lox, loy, loz, c, d)
      cells.push([e0, e2, e1])
      cells.push([e2, e3, e1])
    break;
    case 6:
      e0 = findCrossing(positions, s, lox, loy, loz, a, b)
      e1 = findCrossing(positions, s, lox, loy, loz, a, c)
      e2 = findCrossing(positions, s, lox, loy, loz, b, d)
      e3 = findCrossing(positions, s, lox, loy, loz, c, d)
      cells.push([e1, e0, e2])
      cells.push([e3, e1, e2])
    break;
    case 7:
      e0 = findCrossing(positions, s, lox, loy, loz, a, d)
      e1 = findCrossing(positions, s, lox, loy, loz, b, d)
      e2 = findCrossing(positions, s, lox, loy, loz, c, d)
      cells.push([e1, e2, e0])
    break;
    case 8:
      e0 = findCrossing(positions, s, lox, loy, loz, a, d)
      e1 = findCrossing(positions, s, lox, loy, loz, b, d)
      e2 = findCrossing(positions, s, lox, loy, loz, c, d)
      cells.push([e1, e0, e2])
    break;
    case 9:
      e0 = findCrossing(positions, s, lox, loy, loz, a, b)
      e1 = findCrossing(positions, s, lox, loy, loz, a, c)
      e2 = findCrossing(positions, s, lox, loy, loz, b, d)
      e3 = findCrossing(positions, s, lox, loy, loz, c, d)
      cells.push([e2, e0, e1])
      cells.push([e3, e2, e1])
    break;
    case 10:
      e0 = findCrossing(positions, s, lox, loy, loz, a, b)
      e1 = findCrossing(positions, s, lox, loy, loz, a, d)
      e2 = findCrossing(positions, s, lox, loy, loz, b, c)
      e3 = findCrossing(positions, s, lox, loy, loz, c, d)
      cells.push([e0, e1, e2])
      cells.push([e1, e3, e2])
    break;
    case 11:
      e0 = findCrossing(positions, s, lox, loy, loz, a, c)
      e1 = findCrossing(positions, s, lox, loy, loz, b, c)
      e2 = findCrossing(positions, s, lox, loy, loz, c, d)
      cells.push([e2, e1, e0])
    break;
    case 12:
      e0 = findCrossing(positions, s, lox, loy, loz, a, c)
      e1 = findCrossing(positions, s, lox, loy, loz, a, d)
      e2 = findCrossing(positions, s, lox, loy, loz, b, c)
      e3 = findCrossing(positions, s, lox, loy, loz, b, d)
      cells.push([e1, e0, e2])
      cells.push([e3, e1, e2])
    break;
    case 13:
      e0 = findCrossing(positions, s, lox, loy, loz, a, b)
      e1 = findCrossing(positions, s, lox, loy, loz, b, c)
      e2 = findCrossing(positions, s, lox, loy, loz, b, d)
      cells.push([e1, e2, e0])
    break;
    case 14:
      e0 = findCrossing(positions, s, lox, loy, loz, a, b)
      e1 = findCrossing(positions, s, lox, loy, loz, a, c)
      e2 = findCrossing(positions, s, lox, loy, loz, a, d)
      cells.push([e2, e1, e0])
    break;
    case 15:
    break;
  }
}

function emitSteinerFaces (positions, cells, s, lox, loy, loz, corners, a, b, y, c0, c1, dx, dy, dz) {
  var v = c0
  while (v !== c1) {
    var r = 1 << (30 - v.l)
    var u = null
    while (!u) {
      u = findCorner(corners, v.x + r * dx, v.y + r * dy, v.z + r * dz)
      r <<= 1
    }
    emitTetFaces(positions, cells, s, lox, loy, loz, a, y, u, v)
    emitTetFaces(positions, cells, s, lox, loy, loz, y, b, v, u)
    v = u
  }
}

function emitTopology (index, corners, cellCorners) {
  var tree = index.tree

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
      if (c000.l === l && c010.l === l && c001.l === l && c011.l === l) {
        emitPyramidFaces(positions, cells, s, lox, loy, loz, cc, c000, c010, c001, c011)
        emitPyramidFaces(positions, cells, s, lox, loy, loz, cellCorners[nidx], c000, c001, c010, c011)
      } else {
        steiner = genSteiner(c000, c010, c001, c011)
        ncorner = cellCorners[nidx]
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c000, c010, 0, 1, 0)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c010, c011, 0, 0, 1)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c011, c001, 0, -1, 0)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c001, c000, 0, 0, -1)
      }
    }

    nidx = search(tree, x + r, y, z)
    ncell = octreeCells[nidx]
    if (ncell.l < l) {
      c100 = c100 || findCorner(corners, x + r, y, z)
      c101 = c101 || findCorner(corners, x + r, y, z + r)
      c110 = c110 || findCorner(corners, x + r, y + r, z)
      c111 = c111 || findCorner(corners, x + r, y + r, z + r)
      if (c100.l === l && c101.l === l && c110.l === l && c111.l === l) {
        emitPyramidFaces(positions, cells, s, lox, loy, loz, cc, c100, c101, c110, c111)
        emitPyramidFaces(positions, cells, s, lox, loy, loz, cellCorners[nidx], c100, c110, c101, c111)
      } else {
        steiner = genSteiner(c100, c101, c110, c111)
        ncorner = cellCorners[nidx]
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c100, c101, 0, 0, 1)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c101, c111, 0, 1, 0)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c111, c110, 0, 0, -1)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c110, c100, 0, -1, 0)
      }
    }

    nidx = search(tree, x, y - 1, z)
    ncell = octreeCells[nidx]
    if (ncell.l <= l && nidx !== i) {
      c000 = c000 || findCorner(corners, x, y, z)
      c001 = c001 || findCorner(corners, x, y, z + r)
      c100 = c100 || findCorner(corners, x + r, y, z)
      c101 = c101 || findCorner(corners, x + r, y, z + r)
      if (c000.l === l && c001.l === l && c100.l === l && c101.l === l) {
        emitPyramidFaces(positions, cells, s, lox, loy, loz, cc, c000, c001, c100, c101)
        emitPyramidFaces(positions, cells, s, lox, loy, loz, cellCorners[nidx], c000, c100, c001, c101)
      } else {
        steiner = genSteiner(c000, c001, c100, c101)
        ncorner = cellCorners[nidx]
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c000, c001, 0, 0, 1)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c001, c101, 1, 0, 0)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c101, c100, 0, 0, -1)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c100, c000, -1, 0, 0)
      }
    }

    nidx = search(tree, x, y + r, z)
    ncell = octreeCells[nidx]
    if (ncell.l < l) {
      c010 = c010 || findCorner(corners, x, y + r, z)
      c110 = c110 || findCorner(corners, x + r, y + r, z)
      c011 = c011 || findCorner(corners, x, y + r, z + r)
      c111 = c111 || findCorner(corners, x + r, y + r, z + r)
      if (c010.l === l && c110.l === l && c011.l === l && c111.l === l) {
        emitPyramidFaces(positions, cells, s, lox, loy, loz, cc, c010, c110, c011, c111)
        emitPyramidFaces(positions, cells, s, lox, loy, loz, cellCorners[nidx], c010, c011, c110, c111)
      } else {
        steiner = genSteiner(c010, c110, c011, c111)
        ncorner = cellCorners[nidx]
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c010, c110, 1, 0, 0)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c110, c111, 0, 0, 1)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c111, c011, -1, 0, 0)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c011, c010, 0, 0, -1)
      }
    }

    nidx = search(tree, x, y, z - 1)
    ncell = octreeCells[nidx]
    if (ncell.l <= l && nidx !== i) {
      c000 = c000 || findCorner(corners, x, y, z)
      c100 = c100 || findCorner(corners, x + r, y, z)
      c010 = c010 || findCorner(corners, x, y + r, z)
      c110 = c110 || findCorner(corners, x + r, y + r, z)
      if (c000.l === l && c100.l === l && c010.l === l && c110.l === l) {
        emitPyramidFaces(positions, cells, s, lox, loy, loz, cc, c000, c100, c010, c110)
        emitPyramidFaces(positions, cells, s, lox, loy, loz, cellCorners[nidx], c000, c010, c100, c110)
      } else {
        steiner = genSteiner(c000, c100, c010, c110)
        ncorner = cellCorners[nidx]
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c000, c100, 1, 0, 0)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c100, c110, 0, 1, 0)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c110, c010, -1, 0, 0)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c010, c000, 0, -1, 0)
      }
    }

    nidx = search(tree, x, y, z + r)
    ncell = octreeCells[nidx]
    if (ncell.l < l) {
      c001 = c001 || findCorner(corners, x, y, z + r)
      c011 = c011 || findCorner(corners, x, y + r, z + r)
      c101 = c101 || findCorner(corners, x + r, y, z + r)
      c111 = c111 || findCorner(corners, x + r, y + r, z + r)
      if (c001.l === l && c011.l === l && c101.l === l && c111.l === l) {
        emitPyramidFaces(positions, cells, s, lox, loy, loz, cc, c001, c011, c101, c111)
        emitPyramidFaces(positions, cells, s, lox, loy, loz, cellCorners[nidx], c001, c101, c011, c111)
      } else {
        steiner = genSteiner(c001, c011, c101, c111)
        ncorner = cellCorners[nidx]
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c001, c011, 0, 1, 0)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c011, c111, 1, 0, 0)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c111, c101, 0, -1, 0)
        emitSteinerFaces(positions, cells, s, lox, loy, loz, corners, cc, ncorner, steiner, c101, c001, -1, 0, 0)
      }
    }
  }

  return {
    positions: positions,
    cells: cells
  }
}

function sampleNeighbor (tree, x, y, z) {
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

function compareCorners (a, b) {
  return (a.x - b.x) || (a.y - b.y) || (a.z - b.z)
}

function isoval (v, l) {
  return Math.log(Math.max(v / Math.min(1 - v, 0.9999), 0.001))
}

module.exports = function contourHaar (index, level_) {
  var level = (typeof level_ === 'number') ? +level_ : 0.5
  var i

  var tree = index.tree
  var octreeCells = tree.cells

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
    cc.w = isoval(c.w, level)
    cc.adj = []
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
    corner.w = isoval(sampleNeighbor(tree, corner.x, corner.y, corner.z), level)
    corner.adj = []
  }
  corners.length = ptr

  window.OCTREE_CORNERS = corners.concat(cellCorners)

  // final pass: emit topology
  return emitTopology(index, corners, cellCorners)
}

