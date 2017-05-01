const regl = require('regl')({ extensions: 'OES_element_index_uint' })
const bunny = require('bunny')
const calcNormals = require('angle-normals')
const leg = require('./leg.json')

const rasterizeMesh = require('../rasterize-cells')
const contourHaar = require('../contour')

const camera = require('regl-camera')(regl, {})

console.time('rasterize')
const haarIndex = rasterizeMesh(leg.cells, leg.positions, {depth: 8})
console.timeEnd('rasterize')

console.time('contour')
const haarMesh = contourHaar(haarIndex)
console.timeEnd('contour')

const drawMesh = processMesh(haarMesh)
const drawOriginal = processMesh(leg)

function processMesh ({cells, positions}) {
  return regl({
    frag: `
    precision highp float;
    uniform vec4 color;
    varying vec3 vnormal;
    void main () {
      gl_FragColor = vec4(vnormal, 1);
    }
    `,

    vert: `
    precision highp float;
    attribute vec3 position, normal;
    uniform mat4 view, projection;
    varying vec3 vnormal;
    void main () {
      vnormal = normal;
      gl_Position = projection * view * vec4(position, 1);
    }`,

    attributes: {
      'position': positions,
      'normal': calcNormals(cells, positions)
    },

    uniforms: {
      color: regl.prop('color')
    },

    // primitive: 'lines',

    elements: (() => {
      return cells
      var p = []
      cells.forEach((c) => {
        p.push(
          c[0], c[1],
          c[1], c[2],
          c[2], c[0]
        )
      })
      return p
    })()
  })
}

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

const drawWireBox = regl({
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
      const points = []
      for (var d = 0; d < 3; ++d) {
        for (var dx = 0; dx < 2; ++dx) {
          for (var dy = 0; dy < 2; ++dy) {
            for (var s = 0; s <= 1; s += 1) {
              var x = [0, 0, 0]
              x[d] = s
              x[(d + 1) % 3] = dx
              x[(d + 2) % 3] = dy
              points.push(x)
            }
          }
        }
      }
      return points
    })()
  },
  primitive: 'lines',
  count: 24
})

regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })

  var lo = haarIndex.bounds[0]
  var hi = haarIndex.bounds[1]
  var s = (hi[0] - lo[0]) / (1 << 30)

  function interp (x, y, z) {
    return [s * x + lo[0], s * y + lo[1], s * z + lo[2]]
  }

  camera(() => {
    // drawTree(haarBunny)
    drawMesh({ color: [0, 1, 0, 1] })

    // drawOriginal({ color: [1, 1, 1, 1] })
    /*
    haarIndex.tree.cells.forEach(function ({x, y, z, l}) {
      var r = 1 << (30 - l)
      drawWireBox({
        bounds: [
          interp(x, y, z),
          interp(x + r, y + r, z + r)
        ],
        color: [1, 1, 1, 1]
      })
    })
    */

    /*
    var s = 8.0 / (1 << 30)
    window.OCTREE_CORNERS.forEach(({x, y, z, w, adj}) => {
      var x_ = x * s - 4
      var y_ = y * s - 4
      var z_ = z * s - 4
      var rad = 0.1
      drawBox({
        bounds: [
          [x_ - rad, y_ - rad, z_ - rad],
          [x_ + rad, y_ + rad, z_ + rad]
        ],
        color: [ w, 0.25 * adj.length, -w, 1 ]
      })
    })
    */

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
