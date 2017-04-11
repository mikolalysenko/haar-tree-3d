function expand (v_) {
  var v = v_ & 0x3ff
  v = (v | (v << 16)) & 4278190335
  v = (v | (v << 8)) & 251719695
  v = (v | (v << 4)) & 3272356035
  v = (v | (v << 2)) & 1227133513
  return v
}

module.exports = function (x, y, z) {
  return expand(x) | (expand(y) << 1) | (expand(z) << 2)
}
