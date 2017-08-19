
define(["second_module"], function(dependency) {
  var id = "base_module"
  console.log(id + " has initialized.")
  var mod = {}
  mod.id = id
  mod[dependency.id] = dependency 
  return mod
})
