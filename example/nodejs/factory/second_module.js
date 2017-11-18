if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define("second_module", [], function() {

  var id = "second_module"
  console.log(id + " has initialized.")
  var mod = {}
  mod.id = id
  return mod
})
