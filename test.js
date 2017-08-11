
var path = require("path")
var define = require("amdefine")(module)

	example_module_dir = path.join(process.cwd(), "/example", "/nodejs/", "/amdefine")
	console.log(example_module_dir)

	require(path.join(example_module_dir, "/build", "/entry.js"))
	//define(["require", path.join(example_module_dir, "/build", "/entry.js")], function(req, entry) { 
	define(["entry"], function(entry) { 
		console.log("dsdfsfdf", entry)
	})

//require("./example/nodejs/amdefine/build/entry.js")


