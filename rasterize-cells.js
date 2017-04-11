var createTreeFromPoints = require('./lib/tree-from-points.js')
var createIndex = require('./lib/create-index.js')
var dtypes = require('./lib/haar.js')
var createEmptyNode = dtypes.createEmptyNode

var CLIP_BUFFER = []

function calcDC () {
  var x0 = CLIP_BUFFER[0]
  var y0 = CLIP_BUFFER[1]
  var z0 = CLIP_BUFFER[2]

  var x1 = CLIP_BUFFER[3]
  var y1 = CLIP_BUFFER[4]
  var z1 = CLIP_BUFFER[5]

  var x2 = CLIP_BUFFER[6]
  var y2 = CLIP_BUFFER[7]
  var z2 = CLIP_BUFFER[8]

  return (
    x0 * (y1 * z2 - z1 * y2) +
    y0 * (z1 * x2 - x1 * z2) +
    z0 * (x1 * y2 - y1 * x2)
  ) / 6
}

var CLIP_SCRATCH = []

function clip (polyStart, polyEnd, axis) {
  if (polyEnd <= polyStart + 6) {
    return CLIP_BUFFER.length
  }

  var k, t, ti, x
  CLIP_SCRATCH.length = 0
  var sptr = CLIP_BUFFER.length
  for (var i = polyStart, j = polyEnd - 3; i < polyEnd; i += 3) {
    var ac = CLIP_BUFFER[i + axis]
    var bc = CLIP_BUFFER[j + axis]

    if ((ac <= 0.5) !== (bc <= 0.5)) {
      t = (0.5 - bc) / (ac - bc)
      ti = 1 - t
      for (k = 0; k < 3; ++k) {
        x = ti * CLIP_BUFFER[j + k] + t * CLIP_BUFFER[i + k]
        CLIP_BUFFER.push(x)
        CLIP_SCRATCH.push(x)
      }
      CLIP_BUFFER[CLIP_BUFFER.length - 3 + axis] = 1
      CLIP_SCRATCH[CLIP_SCRATCH.length - 3 + axis] = 0
    }

    if (ac < 0.5) {
      for (k = 0; k < 3; ++k) {
        CLIP_BUFFER.push(CLIP_BUFFER[i + k])
      }
      CLIP_BUFFER[CLIP_BUFFER.length - 3 + axis] = 2 * ac
    } else if (ac > 0.5) {
      for (k = 0; k < 3; ++k) {
        CLIP_SCRATCH.push(CLIP_BUFFER[i + k])
      }
      CLIP_SCRATCH[CLIP_SCRATCH.length - 3 + axis] = 2 * (ac - 0.5)
    } else {
      for (k = 0; k < 3; ++k) {
        CLIP_BUFFER.push(CLIP_BUFFER[i + k])
        CLIP_SCRATCH.push(CLIP_BUFFER[i + k])
      }
      CLIP_BUFFER[CLIP_BUFFER.length - 3 + axis] = 1
      CLIP_SCRATCH[CLIP_SCRATCH.length - 3 + axis] = 0
    }

    j = i
  }

  var mid = CLIP_BUFFER.length
  if (sptr >= mid + 6) {
    mid = CLIP_BUFFER.length = sptr
  }
  if (CLIP_SCRATCH.length > 6) {
    for (var n = 0; n < CLIP_SCRATCH.length; ++n) {
      CLIP_BUFFER.push(CLIP_SCRATCH[n])
    }
  }

  return mid
}

function calcCoeffs (polyStart, polyEnd, K, L) {
  K[0] = K[1] = K[2] = L[0] = L[1] = L[2] = 0
  if (polyStart >= polyEnd) {
    return
  }

  var x0 = CLIP_BUFFER[polyStart]
  var y0 = CLIP_BUFFER[polyStart + 1]
  var z0 = CLIP_BUFFER[polyStart + 2]

  for (var i = polyStart + 6; i < polyEnd; i += 3) {
    var x1 = CLIP_BUFFER[i - 3]
    var y1 = CLIP_BUFFER[i - 2]
    var z1 = CLIP_BUFFER[i - 1]

    var x2 = CLIP_BUFFER[i]
    var y2 = CLIP_BUFFER[i + 1]
    var z2 = CLIP_BUFFER[i + 2]

    var dx1 = x1 - x0
    var dy1 = y1 - y0
    var dz1 = z1 - z0

    var dx2 = x2 - x0
    var dy2 = y2 - y0
    var dz2 = z2 - z0

    var nx = dy1 * dz2 - dz1 * dy2
    var ny = dz1 * dx2 - dx1 * dz2
    var nz = dx1 * dy2 - dy1 * dx2

    var px = x0 + x1 + x2
    var py = y0 + y1 + y2
    var pz = z0 + z1 + z2

    K[0] += nx
    K[1] += ny
    K[2] += nz

    L[0] += px * nx
    L[1] += py * ny
    L[2] += pz * nz
  }

  for (var j = 0; j < 3; ++j) {
    K[j] /= 16
    L[j] /= 48
  }
}

var K_COEFFS = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
]

var L_COEFFS = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
]

function insertCell (node, polyStart, polyEnd, depth) {
  // clip along x
  var x0 = CLIP_BUFFER.length
  var x1 = clip(polyStart, polyEnd, 0)
  var x2 = CLIP_BUFFER.length

  // clip along y
  var x0y0 = CLIP_BUFFER.length
  var x0y1 = clip(x0, x1, 1)
  var x0y2 = CLIP_BUFFER.length

  var x1y0 = CLIP_BUFFER.length
  var x1y1 = clip(x1, x2, 1)
  var x1y2 = CLIP_BUFFER.length

  // clip along z
  var x0y0z0 = CLIP_BUFFER.length
  var x0y0z1 = clip(x0y0, x0y1, 2)
  var x0y0z2 = CLIP_BUFFER.length

  var x0y1z0 = CLIP_BUFFER.length
  var x0y1z1 = clip(x0y1, x0y2, 2)
  var x0y1z2 = CLIP_BUFFER.length

  var x1y0z0 = CLIP_BUFFER.length
  var x1y0z1 = clip(x1y0, x1y1, 2)
  var x1y0z2 = CLIP_BUFFER.length

  var x1y1z0 = CLIP_BUFFER.length
  var x1y1z1 = clip(x1y1, x1y2, 2)
  var x1y1z2 = CLIP_BUFFER.length

  calcCoeffs(x0y0z0, x0y0z1, K_COEFFS[0], L_COEFFS[0])
  calcCoeffs(x1y0z0, x1y0z1, K_COEFFS[1], L_COEFFS[1])
  calcCoeffs(x0y1z0, x0y1z1, K_COEFFS[2], L_COEFFS[2])
  calcCoeffs(x1y1z0, x1y1z1, K_COEFFS[3], L_COEFFS[3])
  calcCoeffs(x0y0z1, x0y0z2, K_COEFFS[4], L_COEFFS[4])
  calcCoeffs(x1y0z1, x1y0z2, K_COEFFS[5], L_COEFFS[5])
  calcCoeffs(x0y1z1, x0y1z2, K_COEFFS[6], L_COEFFS[6])
  calcCoeffs(x1y1z1, x1y1z2, K_COEFFS[7], L_COEFFS[7])

  // update node coefficients
  var K = K_COEFFS
  var L = L_COEFFS
  var coeffs = node.coeffs

  coeffs[0] +=
    L[0][0] +
    K[1][0] - L[1][0] +
    L[2][0] +
    K[3][0] - L[3][0] +
    L[4][0] +
    K[5][0] - L[5][0] +
    L[6][0] +
    K[7][0] - L[7][0]

  coeffs[1] +=
    L[0][1] +
    L[1][1] +
    K[2][1] - L[2][1] +
    K[3][1] - L[3][1] +
    L[4][1] +
    L[5][1] +
    K[6][1] - L[6][1] +
    K[7][1] - L[7][1]

  coeffs[2] += 0.5 * (
    L[0][0]             + L[0][1] +
    K[1][0] - L[1][0]   - L[1][1] +
   -L[2][0]             + K[2][1] - L[2][1] +
    L[3][0] - K[3][0]   + L[3][1] - K[3][1] +
    L[4][0]             + L[4][1] +
    K[5][0] - L[5][0]   - L[5][1] +
   -L[6][0]             + K[6][1] - L[6][1] +
    L[7][0] - K[7][0]   + L[7][1] - K[7][1])

  coeffs[3] +=
    L[0][2] +
    L[1][2] +
    L[2][2] +
    L[3][2] +
    K[4][2] - L[4][2] +
    K[5][2] - L[5][2] +
    K[6][2] - L[6][2] +
    K[7][2] - L[7][2]

  coeffs[4] += 0.5 * (
    L[0][0]           + L[0][2] +
    K[1][0] - L[1][0] - L[1][2] +
    L[2][0]           + L[2][2] +
    K[3][0] - L[3][0] - L[3][2] +
   -L[4][0]           + K[4][2] - L[4][2] +
    L[5][0] - K[5][0] + L[5][2] - K[5][2] +
   -L[6][0]           + K[6][2] - L[6][2] +
    L[7][0] - K[7][0] + L[7][2] - K[7][2])

  coeffs[5] += 0.5 * (
    L[0][1]           + L[0][2] +
    L[1][1]           + L[1][2] +
    K[2][1] - L[2][1] - L[2][2] +
    K[3][1] - L[3][1] - L[3][2] +
   -L[4][1]           + K[4][2] - L[4][2] +
   -L[5][1]           + K[5][2] - L[5][2] +
    L[6][1] - K[6][1] + L[6][2] - K[6][2] +
    L[7][1] - K[7][1] + L[7][2] - K[7][2])

  coeffs[6] += (1 / 3) * (
    L[0][0]           + L[0][1]           + L[0][2] +
    K[1][0] - L[1][0] - L[1][1]           - L[1][2] +
   -L[2][0]           + K[2][1] - L[2][1] - L[2][2] +
    L[3][0] - K[3][0] + L[3][1] - K[3][1] + L[3][2] +
   -L[4][0]           - L[4][1]           + K[4][2] - L[4][2] +
    L[5][0] - K[5][0] + L[5][1]           + L[5][2] - K[5][2] +
    L[6][0]           + L[6][1] - K[6][1] + L[6][2] - K[6][2] +
    K[7][0] - L[7][0] + K[7][1] - L[7][1] + K[7][2] - L[7][2])

  // recurse to children
  if (depth > 1) {
    var child
    var children = node.children
    if (x0y0z0 < x0y0z1) {
      child = children[0] || (children[0] = createEmptyNode())
      insertCell(child, x0y0z0, x0y0z1, depth - 1)
    }
    if (x1y0z0 < x1y0z1) {
      child = children[1] || (children[1] = createEmptyNode())
      insertCell(child, x1y0z0, x1y0z1, depth - 1)
    }
    if (x0y1z0 < x0y1z1) {
      child = children[2] || (children[2] = createEmptyNode())
      insertCell(child, x0y1z0, x0y1z1, depth - 1)
    }
    if (x1y1z0 < x1y1z1) {
      child = children[3] || (children[3] = createEmptyNode())
      insertCell(child, x1y1z0, x1y1z1, depth - 1)
    }
    if (x0y0z1 < x0y0z2) {
      child = children[4] || (children[4] = createEmptyNode())
      insertCell(child, x0y0z1, x0y0z2, depth - 1)
    }
    if (x1y0z1 < x1y0z2) {
      child = children[5] || (children[5] = createEmptyNode())
      insertCell(child, x1y0z1, x1y0z2, depth - 1)
    }
    if (x0y1z1 < x0y1z2) {
      child = children[6] || (children[6] = createEmptyNode())
      insertCell(child, x0y1z1, x0y1z2, depth - 1)
    }
    if (x1y1z1 < x1y1z2) {
      child = children[7] || (children[7] = createEmptyNode())
      insertCell(child, x1y1z1, x1y1z2, depth - 1)
    }
  }

  // pop values from clip buffer
  CLIP_BUFFER.length = x0
}

function rasterizeCells (tree, cells, positions, depth) {
  var i, j, k

  var bounds = tree.bounds
  var lo = bounds[0]
  var hi = bounds[1]
  var diameter = hi[0] - lo[0]

  for (i = 0; i < cells.length; ++i) {
    var c = cells[i]
    if (c.length !== 3) {
      continue
    }

    CLIP_BUFFER.length = 0
    for (j = 0; j < 3; ++j) {
      var q = positions[c[j]]
      for (k = 0; k < 3; ++k) {
        CLIP_BUFFER.push((q[k] - lo[k]) / diameter)
      }
    }

    // update dc coefficient
    tree.coeff += calcDC()

    // insert into children
    insertCell(tree.root, 0, 9, depth)
  }
}

module.exports = function (cells, positions, options) {
  if (!cells) {
    throw new Error('haar-rasterize-cells: missing cells')
  }
  var tree = createTreeFromPoints(positions, options)
  rasterizeCells(tree, cells, positions, tree.depth)
  return createIndex(tree)
}
