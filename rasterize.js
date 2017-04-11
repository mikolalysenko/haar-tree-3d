var dtypes = require('./lib/haar')


module.exports = rasterize

function rasterize (options) {
  if (!options) {
    throw new Error('haar-rasterize: missing options')
  }

  var positions = options.positions
  if (!positions) {
    throw new Error('haar-rasterize: must specify positions')
  }

  if (positions.length === 0) {
    return null
  }

  var dimension = positions[0].length

  var tree = options.tree || createEmptyTree(positions, dimension)
  var cells = options.cells

  var diam = tree.bounds[1][0] - tree.bounds[0][0]

  var depth = options.depth | 0
  if (!depth) {
    if (options.resolution) {
      depth = Math.ceil(Math.log2(diam / options.resolution))
    } else {
      depth = 8
    }
  }
  if (depth <= 0) {
    throw new Error('haar-rasterize: invalid depth')
  }

  if (cells) {
    rasterizeCells(tree, cells, positions, depth)
  } else {
    var normals = options.normals || estimateNormals(positions)
    rasterizePoints(tree, positions, normals, depth)
  }

  tree.depth = Math.max(tree.depth, depth)

  return tree
}
