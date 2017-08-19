if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define("entry", ["module_one", "second_module"], function(one, two) {
  var id = "entry"
  console.log(id + " has initialized.")
  var mod = {}
  mod.id = id
  mod[one.id] = one
  mod[two.id] = two
  return mod
})
