if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define("entry", ["module_one", "second_module"], function(one, two) {

  console.log("entry has initialized.")
  var mod = {}
  mod.id = "entry" 
  mod[one.id] = one
  mod[two.id] = two
  return mod
})
