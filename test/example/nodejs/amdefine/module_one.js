if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {

  var id = "module_one"
  var mod = {}
  mod.id = id
  return mod
})
