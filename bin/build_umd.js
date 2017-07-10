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

	fs.writeFile(lib + "/../builds/" + "wrap_start_umd"+config.version+".frag", compressed.code.substr(8, compressed.code.length-11), (err) => {
  	if (err) throw err
  	fs.writeFile(lib + "/../builds/" + "wrap_end_umd"+config.version+".frag", "}", (err) => {
    	if (err) throw err
  		else console.log("Finished uglify build wrapping.")
  	})
	})
})


//proc.fork(lib + "/umd.js", process.argv.slice(2), {execArgv: process.execArgv})
