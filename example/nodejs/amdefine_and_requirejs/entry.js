



var m = require("./my_module")
console.log(m)

var requirejs = require("requirejs")
var define = require("amdefine")(module)
var m = requirejs(["./my_module"], function(mod) {
  console.log(mod)
})
