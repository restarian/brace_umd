
define(["module_one", "second_module"], function(one, two) {
  var id = "entry"
  console.log(id + " has initialized.")
  var mod = {}
  mod.id = id
  mod[one.id] = one
  mod[two.id] = two
  return mod
})
