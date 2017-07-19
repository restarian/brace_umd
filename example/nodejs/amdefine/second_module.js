

define(["module_two"], function(two) {
  console.log("Init second_module")

  return {
    two: two,
    id: "second_module"
  }

})
define("module_two", [], function() {
  console.log("The second module in the example direcotry is set.")
  return {
    id: "module_two"
  }

})
