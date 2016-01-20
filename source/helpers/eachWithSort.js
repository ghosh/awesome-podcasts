module.exports = function (array, key, opts) {
  var e, i, len, s;
  array = array.sort(function(a, b) {
    a = a[key];
    b = b[key];
    if (a > b) {
      return 1;
    }
    if (a === b) {
      return 0;
    }
    if (a < b) {
      return -1;
    }
  });
  s = '';
  for (i = 0, len = array.length; i < len; i++) {
    e = array[i];
    s += opts.fn(e);
  }
  return s;
}
