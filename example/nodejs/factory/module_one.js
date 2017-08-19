if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
  var id = "module_one"
  console.log(id + " has initialized.")
  var mod = {}
  mod.id = id
  return mod
})
