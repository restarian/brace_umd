/* MIT License
Copyright (c) 2018 Robert Steckroth <RobertSteckroth@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

  Brace UMD is a unified module definition script to use when defining javascript modules.

  this file is a part of Brace UMD

 Author: Robert Edward Steckroth II, Bustout, <RobertSteckroth@gmail.com> */

var path = require("path"),
	fs = require("fs"),
   // The present working directory can be anything is nodejs so the absolute path from this script is required to read from the module directory.
	build_dir = path.join(path.dirname(fs.realpathSync(__filename)), "..", "build")

// This exports Object contains all of the current build files and data created with the build_umd script. This is the main entry point in the package.json.
module.exports = exports = {
	// readFileSync is used with JSON.parse instead of require to prevent the require.cache link. Otherwise, the parent module would be unable to 
	// remove itself with the module cache here.
	umd: fs.readFileSync(path.join(build_dir, "umd.js")).toString(),
	build_option: JSON.parse(fs.readFileSync(path.join(build_dir, "build_options.json")).toString()),
	build_option_extend: function(obj) {
		// This is for convenience when used with the r.js build file loader. E.g. uglify2: nodeRequire("brace_umd").build_option_extend({output: 
		// {beautify: true}}). The options can only be passed to the r_js script this way.

		var build_option = JSON.parse(fs.readFileSync(path.join(build_dir, "build_options.json")).toString())

		var set_val = function(base, val) {

			for ( var o in val ) 
				if ( typeof val[o] === "object" && typeof base[o] === "object" )
					set_val(base[o], val[o])
				else 
					base[o] = val[o]
			return base
		}
	
		return set_val(build_option, obj)
	},
	// This is meta data created by the build_umd program.
	build_program_path: path.join(path.dirname(fs.realpathSync(__filename)), "..", "bin", "build_umd.js"),
	build_information: JSON.parse(fs.readFileSync(path.join(build_dir, "build_information.json")).toString()),
	wrap_start_file: path.join(build_dir, "wrap_start_umd.frag"),
	wrap_end_file: path.join(build_dir, "wrap_end_umd.frag"),
	wrap_start: fs.readFileSync(path.join(build_dir, "wrap_start_umd.frag")).toString(),
	wrap_end: fs.readFileSync(path.join(build_dir, "wrap_end_umd.frag")).toString(),
	wrap_end_option: function(opt) { 
		// Adds options data in the form of a Object to the closing fragment of the umd source text. The option data will remain compliant with Uglify-js 
		// option passing as long as the data provided is compliant with it.
		var s = this.wrap_end, original = {}
		if ( typeof opt === "object" && Object.keys(opt).length ) {
			try {
				// Pull out the starting option Object from the function call enclosure text.
				original = JSON.parse(s.match(/\,\s*(\{.*\})\s*\)[\;,\s]*$/)[1])
				for ( var a in opt ) 
					original[a] = opt[a]
			} catch(e) { console.log(e); return s }
			// This returns JSON parsable text to create the updated options Object.
			s = s.replace(/\,\s*\{.*\}\s*(\)[\;,\s]*)$/, ","+JSON.stringify(original)+"$1" )
		}
		return s
	},
}
