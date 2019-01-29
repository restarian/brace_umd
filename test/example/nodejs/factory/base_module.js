if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define("second_module", [], function() {

  var id = "second_module"
  var mod = {}
  mod.id = id
  return mod
})

define(["second_module"], function(second) {

	var m = function() {
	
	return {second: second}
  }

  m.id = "base_module"

  return m
  
})
