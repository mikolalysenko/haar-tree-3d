const regl = require('regl')()
const bunny = require('bunny')
const leg = require('./leg.json')
const rasterizeMesh = require('../rasterize-cells')
const camera = require('regl-camera')(regl, {})

// debugger

const cubePoints = []
const cubeCells = []

function emitCube (cx, cy, cz) {
  for (var d = 0; d < 3; ++d) {
    for (var s = -1; s <= 1; s += 2) {
      var u = [0, 0, 0]
      var v = [0, 0, 0]
      var x = [cx, cy, cz]

      x[d] += s
      if (s > 0) {
        u[(d + 1) % 3] = 1
        v[(d + 2) % 3] = 1
      } else {
        v[(d + 1) % 3] = 1
        u[(d + 2) % 3] = 1
      }

      var I = cubePoints.length

      for (var du = -1; du < 2; du += 2) {
        for (var dv = -1; dv < 2; dv += 2) {
          var h = [0, 0, 0]
          for (var i = 0; i < 3; ++i) {
            h[i] = x[i] + du * u[i] + dv * v[i]
          }
          cubePoints.push(h)
        }
      }

      cubeCells.push(
        [I, I + 1, I + 2],
        [I + 2, I + 1, I + 3])
    }
  }
}

const haarBunny = rasterizeMesh(leg.cells, leg.positions, {depth: 4})
var flatCells = require('../lib/flatten')(haarBunny)
// var codeDelta = require('../lib/delta')
// var locateCell = require('../lib/locate')
for (var i = 0; i < flatCells.length; ++i) {
  for (var j = 0; j < flatCells.length; ++j) {
    var ac = flatCells[i]
    var bc = flatCells[j]
    var d = (ac.c0 - bc.c0) || (ac.c1 - bc.c1) || (ac.c2 - bc.c2)
    if ((i < j) !== (d < 0)) {
      console.log('error:', i, j, d, flatCells[i], flatCells[j])
    } else if (i === j && d !== 0) {
      console.log('error:', i, d, flatCells[i])
    }
  }
}

/*
for (var ix = 0; ix < 256; ix += 4) {
  for (var iy = 0; iy < 256; iy += 4) {
    for (var iz = 0; iz < 256; iz += 4) {
      var idx = locateCell(flatCells, ix, iy, iz, 8)
      var cell = flatCells[idx]
      console.log(cell, idx, ix, iy, iz)
    }
  }
}
*/

const drawMesh = regl({
  frag: `
  precision highp float;
  uniform vec4 color;
  void main () {
    gl_FragColor = color;
  }
  `,

  vert: `
  precision highp float;
  attribute vec3 position;
  uniform mat4 view, projection;
  void main () {
    gl_Position = projection * view * vec4(position, 1);
  }`,

  attributes: {
    'position': leg.positions
  },

  uniforms: {
    color: regl.prop('color')
  },

  primitive: 'lines',

  elements: (() => {
    var p = []
    leg.cells.forEach((c) => {
      p.push(
        c[0], c[1],
        c[1], c[2],
        c[2], c[0]
      )
    })
    return p
  })()
})

const drawNodeEdges = regl({
  frag: `
  precision highp float;
  uniform vec3 bounds[2];
  void main () {
    gl_FragColor = vec4(0.5 * (1. + bounds[0] + bounds[1]), 1);
  }
  `,

  vert: `
  precision highp float;
  attribute vec3 position;
  uniform vec3 bounds[2];
  uniform mat4 view, projection;
  void main () {
    vec3 p = mix(bounds[0], bounds[1], position);
    gl_Position = projection * view * vec4(p, 1);
  }`,

  uniforms: {
    'bounds[0]': regl.prop('bounds[0]'),
    'bounds[1]': regl.prop('bounds[1]')
  },

  attributes: {
    'position': regl.prop('edges')
  },

  primitive: 'lines',

  count: (_, {edges}) => edges.length / 3
})

const drawBox = regl({
  frag: `
  precision highp float;
  uniform vec4 color;
  void main () {
    gl_FragColor = 0.25 * color;
  }`,

  vert: `
  precision highp float;
  attribute vec3 position;
  uniform vec3 bounds[2];
  uniform mat4 view, projection;
  void main () {
    vec3 p = mix(bounds[0], bounds[1], position);
    gl_Position = projection * view * vec4(p, 1);
  }`,

  uniforms: {
    'bounds[0]': regl.prop('bounds[0]'),
    'bounds[1]': regl.prop('bounds[1]'),
    'color': regl.prop('color')
  },

  blend: {
    enable: true,
    func: {
      src: 'one',
      dst: 'one'
    },
    equation: 'add'
  },

  depth: {
    enable: true,
    mask: false
  },

  attributes: {
    position: (function () {
      const TAB = [
        [1, 1],
        [0, 1],
        [1, 0],
        [1, 0],
        [0, 1],
        [0, 0]
      ]

      const points = []
      for (var d = 0; d < 3; ++d) {
        for (var s = 0; s <= 1; s += 1) {
          var x = [0, 0, 0]
          x[d] = s
          var du = [0, 0, 0]
          du[(d + 1 + s) % 3] = 1
          var dv = [0, 0, 0]
          dv[(d + 2 - s) % 3] = 1

          for (var i = 0; i < TAB.length; ++i) {
            var t = TAB[i]
            for (var j = 0; j < 3; ++j) {
              points.push(x[j] + t[0] * du[j] + t[1] * dv[j])
            }
          }
        }
      }

      return points
    })()
  },

  count: 36,
  offset: 0,
  primitive: 'triangles'
})

function drawNode (node, bounds, weight, boxes) {
  if (!node) {
    boxes.push({
      bounds,
      color: [weight, weight, weight, 1]
    })
    return
  }
  /*
  drawNodeEdges({
    bounds,
    edges: node.edges
  })
  */
  for (var i = 0; i < node.children.length; ++i) {
    var w = weight
    var b = [bounds[0].slice(), bounds[1].slice()]
    for (var j = 0; j < 3; ++j) {
      var x = 0.5 * (bounds[0][j] + bounds[1][j])
      if (i & (1 << j)) {
        b[0][j] = x
      } else {
        b[1][j] = x
      }
    }
    for (var k = 0; k < 7; ++k) {
      var s = (k + 1) & i
      var p = 1
      for (var l = 0; l < 3; ++l) {
        if (s & (1 << l)) {
          p = -p
        }
      }
      w += p * node.coeffs[k]
    }
    drawNode(node.children[i], b, w, boxes)
  }
}

function drawTree (tree) {
  var boxes = []
  drawNode(tree.root, tree.bounds, tree.coeff, boxes)
  drawBox(boxes)
}

regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })

  camera(() => {
    drawTree(haarBunny)
    // drawMesh({ color: [0, 1, 0, 1] })
    /*
    drawBox({
      bounds: [
        [-1, -1, -1],
        [1, 1, 1]
      ],
      color: [0.25, 0.25, 0.25, 1]
    })
    */
  })
})
