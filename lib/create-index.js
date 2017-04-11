var createBTree = require('./btree').create
var flatten = require('./flatten')

function BTreeIndex (btree, bounds, depth) {
  this.tree = btree
  this.bounds = bounds
  this.depth = depth
}

module.exports = function (octree) {
  var cells = flatten(octree)
  var btree = createBTree(cells)
  return new BTreeIndex(btree, octree.bounds, octree.depth)
}
