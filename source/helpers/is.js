module.exports = function (value, test, options) {
  if (value === test) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}
