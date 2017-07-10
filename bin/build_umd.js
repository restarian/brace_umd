#!/usr/bin/env node

var path = require("path"),
fs = require("fs"),
lib = path.join(path.dirname(fs.realpathSync(__filename)), "../lib"),
config = require("../package.json")

var uglify = require("uglify-js")
var out = lib + "/../builds/" + "umd_"+config.version+".js"

var options = {

  output: {
      beautify: false,//true
  },
  compress: {
      //sequences: false,
      sequences: true,
      global_defs: {
          DEBUG: false
      },
  		unsafe: true,
  		properties: false,
  },
  warnings: true,
//  mangle: false
  mangle: true
}

fs.readFile(lib+"/umd.js", (err, data) => {
  if (err) { throw err }
  else {

  	var compressed = uglify.minify(data.toString(), options) // parse code and get the initial AST
  	fs.writeFile(out, compressed.code, (err) => {
    	if (err) { throw err }
  		else { console.log("Finished uglify build:", out) }
  	})

  	fs.writeFile(lib + "/../builds/" + "wrap_start_umd_"+config.version+".frag", "(" + compressed.code.substr(8, compressed.code.length-12), (err) => {
    	if (err) { throw err }
      else {
          //console.log(fs.readFileSync(lib + "/../builds/" + "wrap_start_umd"+config.version+".frag").toString())
      }
    	fs.writeFile(lib + "/../builds/" + "wrap_end_umd_"+config.version+".frag", "}", (err) => {
      	if (err) throw err
    		else console.log("Finished uglify build wrapping.")
    	})
  	})
  }
})


//proc.fork(lib + "/umd.js", process.argv.slice(2), {execArgv: process.execArgv})
