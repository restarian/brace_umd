#!/usr/bin/env node

var path = require("path"),
fs = require("fs"),
lib = path.join(path.dirname(fs.realpathSync(__filename)), "../lib"),
config = require("../package.json")

var uglify = require("uglify-js")
var out = lib + "/../builds/" + "umd_"+config.version+".js"
var options = {}

fs.readFile(lib+"/umd.js", (err, data) => {
  if (err) throw err

	var compressed = uglify.minify(data.toString(), options) // parse code and get the initial AST

	fs.writeFile(out, compressed.code, (err) => {
  		if (err) throw err
		else console.log("Finished uglify build:", out)
	})

})


//proc.fork(lib + "/umd.js", process.argv.slice(2), {execArgv: process.execArgv})
