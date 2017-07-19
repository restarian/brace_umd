
define(["module_one", "second_module"], function(one, two) {
  console.log("entry module init")
  return {
    id: "entry",
    one: one,
    two: two
  }

})
