function HaarNode (coeffs, children) {
  this.coeffs = coeffs
  this.children = children
}

function HaarTree (bounds, coeff, root, depth) {
  this.bounds = bounds
  this.coeff = coeff
  this.root = root
  this.depth = depth
}

function createEmptyNode () {
  return new HaarNode([0, 0, 0, 0, 0, 0, 0], [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ])
}

function createEmptyTree (bounds, depth) {
  return new HaarTree(bounds, 0, createEmptyNode(), depth)
}

module.exports = {
  HaarNode,
  HaarTree,
  createEmptyNode,
  createEmptyTree
}
