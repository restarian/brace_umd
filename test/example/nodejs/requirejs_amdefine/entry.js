
if (typeof requirejs !== 'function') {
	var requirejs = require("requirejs")
}

requirejs.config({baseUrl: "./", nodeRequire: require})

//requirejs.define("here", [], function(one) { return one })
//requirejs.define("here", ["./module_one"], function(one) { return one })

requirejs(["./second_module"], function(here, two) {

  var id = "requirejs entry"
  var mod = {}
  mod.id = id
  return mod
})

define([], function() { return {id: "entry"} })

