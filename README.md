# haar-tree-3d
This module is an implementation of a sparse 3-dimensional Haar wavelet basis. You can use it to do the following:

* Voxelize boundary representations (polygons, meshes, etc.)
* Convert point clouds to meshes
* Perform CSG operations

It is based on some ideas from Josiah Manson and Scott Schaefer:

* Wavelett Rasterization
* Wavelett contouring
* Multires surface extraction

## Install

```
npm i haar-tree-3d
```

## Usage

### Rasterization

#### `var tree = require('haar-3d/rasterize-points')(points, normals, [options])`

* `points`
* `normals`
* `options`
    + `options.depth`
    + `options.tree`

**Returns** `tree`, a Haar wavelet tree containing the rasterized points

#### `var tree = require('haar-3d/rasterize-cells)(cells, positions[, options])`

* `cells`
* `positions`
* `options`
    + `options.depth`
    + `options.tree`

**Returns** `tree`

### Sampling

#### `var value = require('haar-3d/sample')(tree, x, y, z)`
Samples the Haar wavelet tree at a specific point `(x, y, z)` in 3D space

* `tree` is the Haar tree
* `x,y,z` are the coordinates of the point

#### `var array = require('haar-3d/to-ndarray')(tree[, options])`
Converts the Haar tree into an ndarray.  Note that this representation is not very efficient.

* `tree` is the Haar tree
* `options` is a data structure with

### Contouring

#### `var mesh = require('haar-3d/contour')(tree)`

## License
(c) 2017- Mikola Lysenko
