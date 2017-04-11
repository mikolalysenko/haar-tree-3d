var ch = require('convex-hull')

var points = [
  [0, 0, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [-1, 1, 1],
  [1, 1, 1]
]

var edges = [
  [1, 0],
  [2, 0],
  [3, 0],
  [4, 0],
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4]
]

var edgePoints = edges.map(function (e) {
  var a = points[e[0]]
  var b = points[e[1]]
  var y = [0, 0, 0]
  for (var i = 0; i < 3; ++i) {
    y[i] = 0.5 * (a[i] + b[i])
  }
  return y
})

var ftable = []
var etable = []

var edgeOffset = new Array(edges.length)
for (var i = 0; i < (1 << points.length); ++i) {
  var pp = []
  for (var j = 0; j < points.length; ++j) {
    if (i & (1 << j)) {
      pp.push(points[j])
    }
  }
  var shift = pp.length
  var emask = 0
  for (var k = 0; k < edges.length; ++k) {
    var a = edges[k][0]
    var b = edges[k][1]
    if (((i >> a) ^ (i >> b)) & 1) {
      edgeOffset[k] = pp.length - shift
      pp.push(edgePoints[k])
      emask |= (1 << k)
    } else {
      edgeOffset[k] = -1
    }
  }
  var bnd = ch(pp)
  var faces = []
  bnd.forEach(function (cell) {
    var recell = cell.slice()
    for (var i = 0; i < cell.length; ++i) {
      var p = pp[cell[i]]
      if (points.indexOf(p) >= 0) {
        return
      }
      var ei = edgePoints.indexOf(p)
      if (ei < 0) {
        throw new Error('something is terribly broken')
      }
      var xc = edgeOffset[ei]
      if (xc < 0) {
        throw new Error('this should not happen')
      }
      recell[i] = xc
    }
    faces.push(recell)
  })
  etable[i] = emask
  ftable[i] = faces
}

console.log(`// THIS FILE IS GENERATED. DO NOT MODIFY
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

  var t = bw / (aw - bw)
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
${(function () {
  var result = []
  var labels = [
    'a',
    'c00',
    'c01',
    'c10',
    'c11'
  ]

  for (var i = 0; i < etable.length; ++i) {
    result.push(`    case ${i}:`)

    var emask = etable[i]
    var count = 0
    for (var j = 0; j < edges.length; ++j) {
      var e = edges[j]
      if (emask & (1 << j)) {
        result.push(`      e${count++} = findCrossing(positions, s, lox, loy, loz, ${labels[e[0]]}, ${labels[e[1]]})`)
      }
    }

    var faces = ftable[i]
    for (var k = 0; k < faces.length; ++k) {
      var f = faces[k]
      result.push(`      cells.push([e${f[0]}, e${f[1]}, e${f[2]}])`)
    }

    result.push('    break;')
  }

  return result.join('\n')
})()}
  }
}

function findCorner (corners, x, y, z) {
  var lo = 0
  var hi = corners.length
  while (lo < hi) {
    var mid = (lo + hi) >> 1
    var c = corners[mid]
    var d = (c.x - x) || (c.y - y) || (c.z - z)
    if (d < 0) {
      hi = mid - 1
    } else if (d > 0) {
      lo = mid + 1
    } else {
      return c
    }
  }
  return corners[lo]
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
    var w = c.w - level
    var r = 1 << (30 - l)

    // Read in the 8 corners around the cell
${(function () {
  var result = []
  var offset = [
    '',
    ' + r'
  ]
  for (var dz = 0; dz < 2; ++dz) {
    for (var dy = 0; dy < 2; ++dy) {
      for (var dx = 0; dx < 2; ++dx) {
        result.push(`    var c${dx}${dy}${dz} = findCorner(corners, x${offset[dx]}, y${offset[dy]}, z${offset[dz]})`)
      }
    }
  }
  return result.join('\n')
})()}

    // Emit faces for each neighbor
    var nidx, ncell
    ${(function () {
      var result = []
      emitFaceCheck(0, -1, 'c000', 'c010', 'c001', 'c011')
      emitFaceCheck(0, 1, 'c100', 'c101', 'c110', 'c111')
      emitFaceCheck(1, -1, 'c000', 'c001', 'c100', 'c101')
      emitFaceCheck(1, 1, 'c010', 'c011', 'c011', 'c111')
      emitFaceCheck(2, -1, 'c000', 'c100', 'c010', 'c110')
      emitFaceCheck(2, 1, 'c010', 'c011', 'c011', 'c111')
      return result.join('\n')

      function emitFaceCheck (d, s, c00, c01, c10, c11) {
        var offset = ['x', 'y', 'z']
        if (s < 0) {
          offset[d] += ' - 1'
        } else {
          offset[d] += ' + r'
        }
        result.push(`
    nidx = search(tree, ${offset.join(', ')})
    ncell = cells[nidx]
    if (ncell.l ${s < 0 ? '<= l && nidx !== i' : '< l'}) {
      emitPyramidFaces(positions, cells, s, lox, loy, loz, cc, ${c00}, ${c01}, ${c10}, ${c11})
      emitPyramidFaces(positions, cells, s, lox, loy, loz, cellCorners[nidx], ${c00}, ${c10}, ${c01}, ${c11})
    }`)
      }
    })()}
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

    ${(function () {
      var result = []
      var tab = ['', ' + r']
      for (var dz = 0; dz < 2; ++dz) {
        for (var dy = 0; dy < 2; ++dy) {
          for (var dx = 0; dx < 2; ++dx) {
            result.push(`corners[cptr++] = new Corner(x${tab[dx]}, y${tab[dy]}, z${tab[dz]})`)
          }
        }
      }
      return result.join('\n    ')
    })()}

    var cc = new Corner(x + (r >> 1), y + (r >> 1), z + (r >> 1))
    cc.w = 8 * (c.w - level)
    cc.adj = []
    cellCorners[i] = cc
  }

  // 2nd pass: sort corners
  corners.sort(compareCorners)

  // 3rd pass: compute weights for each corner
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

  // final pass: emit topology
  return emitTopology(index, corners, cellCorners)
}
`)
