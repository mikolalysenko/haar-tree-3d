# haar-tree-3d
This module is an implementation of a sparse 3-dimensional Haar wavelet basis. You can use it to do the following:

* Voxelize boundary representations (polygons, meshes, etc.)
* Fill holes in meshes
*

It is based on the following results

* Wavelett Rasterization
* Wavelett contouring
* Multires surface extraction

## Install

```
npm i haar-tree-3d
```

## Usage

### Rasterization

#### `var tree = require('haar-3d/rasterize-cells)(cells, positions[, options])`

Rasterizes a triangular mesh into a sparse wavelet representation

* `cells` cells are the faces of the mesh
* `positions` positions are the locations of the vertices of the mesh
* `options`
    + `options.depth` depth is the depth of the octree

**Returns** A sparse wavelet tree encoding the meshes

### Sampling

#### `var value = require('haar-3d/sample')(tree, x, y, z)`
Samples the Haar wavelet tree at a specific point `(x, y, z)` in 3D space

* `tree` is the Haar tree
* `x,y,z` are the coordinates of the point

#### `var array = require('haar-3d/to-ndarray')(tree[, options])`
Converts the Haar tree into an ndarray.  Note that this representation is not very efficient.

* `tree` is the Haar tree

### Contouring

#### `var mesh = require('haar-3d/contour')(tree)`
Extracts a contour from a mesh field

* `tree` is a Haar tree

## License
(c) 2017- Mikola Lysenko
