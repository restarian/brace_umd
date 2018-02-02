if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["second_module"], function(dependency) {

  var id = "base_module"
  var mod = {}
  mod.id = id
  mod[dependency.id] = dependency 
  return mod
})
