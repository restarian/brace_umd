#!/usr/bin/env node

var path = require("path"),
fs = require("fs"),
lib = path.join(path.dirname(fs.realpathSync(__filename)), "../lib"),
config = require("../package.json"),
uglify = require("uglify-js")

var options = {

  output: {
      beautify: true,
      ast: true
  },
  compress: {
      //sequences: false,
      sequences: false,//true,
      global_defs: {
          DEBUG: false
      },
  		unsafe: true,
  		properties: false,
  },
  warnings: true,
  mangle: true
}

fs.readFile(lib + "/umd.js", (err, data) => {
  if (err) { throw err; return }

	var compressed = uglify.minify(data.toString(), options), location = lib + "/../builds/" + "umd_"+config.version+".js"

  // Here is where the mangled name of the first argument(root) is retrieved from the code ast created by the uglify-js minify call (make sure to set ast: true in output options).
  var mangled_argument = "root"
  var consolidate = new uglify.TreeTransformer(null, function(ast_node){

    // AST_SymbolDeclaration is when a namespace is first declared in a scope and AST_Toplevel is the global scope of the code passed in. The argument needed will be inside
    // the function scope so any function name will not be mangled (the function argument is the one needed).
    if ( ast_node instanceof uglify.AST_SymbolDeclaration && !(ast_node.scope instanceof uglify.AST_Toplevel) && ast_node.name === "root" ) {
      mangled_argument = ast_node.thedef.mangled_name || "root"
    }
  })
  compressed.ast.transform(consolidate, options)

	fs.writeFile(location, compressed.code, (err) => {
  	if (err) { throw err; return }
    console.log("Finished uglify build of main script:", location)

    var out = compressed.code.substr(0, compressed.code.length-12).replace(/var umd\=/, "var umd=require=define=")

    out = "(function("+ mangled_argument +"){" + out + "})"
    location = lib + "/../builds/" + "wrap_start_umd_"+config.version+".frag"
  	fs.writeFile(location, out, (err) => {
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
