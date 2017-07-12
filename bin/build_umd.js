#!/usr/bin/env node

var path = require("path"),
fs = require("fs"),
lib = path.join(path.dirname(fs.realpathSync(__filename)), "../lib"),
config = require("../package.json"),
uglify = require("uglify-js")

var options = {

  output: {
      beautify: false 
  },
  compress: {
      sequences: true,//true,
      dead_code: false,
      unused: false,
      global_defs: {
          DEBUG: false
      },
  		unsafe: true,
  		properties: false,
  },
  warnings: true,
  mangle: false
}

fs.readFile(lib + "/umd.js", (err, data) => {
  if (err) { throw err; return }

	var out = uglify.minify(data.toString(), options), location = lib + "/../builds/" + "umd_"+config.version+".js"

	fs.writeFile(location, "var umd="+out.code, (err) => {
  	if (err) { throw err; return }
    console.log("Finished uglify build of main script:", location)

    location = lib + "/../builds/" + "wrap_start_umd_"+config.version+".frag"
  	fs.writeFile(location, out.code.substr(0, out.code.length-14), (err) => {
      if (err) { throw err; return }
  		console.log("Finished uglify build start wrap:", location)
      location = lib + "/../builds/" + "wrap_end_umd_"+config.version+".frag"
  	  fs.writeFile(location, "})(this)", (err) => {
        if (err) { throw err; return }
    		console.log("Finished uglify build end wrap:", location)
    	})
  	})
	})
})
