var Haar = require('./haar.js')

function pointBounds (points) {
  var i
  var lo = [Infinity, Infinity, Infinity]
  var hi = [-Infinity, -Infinity, -Infinity]

  for (i = 0; i < points.length; ++i) {
    var p = points[i]
    for (var j = 0; j < 3; ++j) {
      lo[j] = Math.min(p[j], lo[j])
      hi[j] = Math.max(p[j], hi[j])
    }
  }

  var diam = Math.max(
    hi[0] - lo[0],
    hi[1] - lo[1],
    hi[2] - lo[2])
  for (i = 0; i < 3; ++i) {
    var c = 0.5 * (lo[i] + hi[i])
    lo[i] = c - 0.75 * diam
    hi[i] = c + 0.75 * diam
  }

  return [lo, hi]
}

function squarify (bounds) {
  var radius = 0.5 * Math.max(
    bounds[1][0] - bounds[0][0],
    bounds[1][1] - bounds[0][1],
    bounds[1][2] - bounds[0][2])

  var cx = 0.5 * (bounds[0][0] + bounds[1][0])
  var cy = 0.5 * (bounds[0][1] + bounds[1][1])
  var cz = 0.5 * (bounds[0][2] + bounds[1][2])

  return [
    [cx - radius, cy - radius, cz - radius],
    [cx + radius, cy + radius, cz + radius]
  ]
}

module.exports = function createTreeFromPoints (positions, options_) {
  var options = options_ || {}
  if (!positions || !positions.length) {
    throw new Error('haar-rasterize: must specify positions')
  }

  var bounds
  if ('bounds' in options) {
    bounds = squarify(options.bounds)
  } else {
    bounds = pointBounds(positions)
  }

  var diam = bounds[1][0] - bounds[0][0]

  var depth = options.depth | 0
  if (!depth) {
    if (options.resolution) {
      depth = Math.ceil(Math.log2(diam / options.resolution))
    } else {
      depth = 8
    }
  }
  if (!depth) {
    throw new Error('haar-rasterize: invalid depth')
  }

  return Haar.createEmptyTree(bounds, depth)
}
