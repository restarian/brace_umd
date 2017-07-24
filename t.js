var requirejs = require("requirejs")

requirejs(["require", "./example/nodejs/amdefine/build/entry.js"], function(require, library_module) {

	console.log("cool joes")
})

//requirejs(["require", "c:/Users/Rober/AppData/Roaming/npm/node_modules/brace_umd/example/nodejs/amdefine/build/entry"], function(r, l) { var mod_one = r("module_one") })
