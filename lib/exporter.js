/*
Copyright (c) 2017 Robert Steckroth <RobertSteckroth@gmail.com>

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

 Author: Robert Edward Steckroth II, Bustout, <RobertSteckroth@gmail.com>
*/

/* The exporter script returns a module with the current build files created with the build_umd script. This is the main entry point in the package.json.
*/
var path = require("path"),
	fs = require("fs"),
  // The present working directory can be anything is nodejs so The absolute path from this script is required to read from the module directory.
	build_dir = path.join(path.dirname(fs.realpathSync(__filename)), "../build/"),
  version = JSON.parse(fs.readFileSync(path.join(build_dir, "../package.json"))).version

module.exports = {
	// readFileSync is used with JSON.parse instead of require to prevent the require.cache link. Otherwise, the parent module would be unable to remove itself with the module cache here.
	umd: fs.readFileSync(build_dir + "umd_"+version+".js").toString(),
	build_option: JSON.parse(fs.readFileSync(build_dir + "build_options_"+version+".json").toString()),
	build_option_extend: function(obj) {

		// This is for convenience when used with the r.js build file loader. E.g. uglify2: nodeRequire("brace_umd").build_option_extend({output: {beautify: true}}),
		var option = JSON.parse(fs.readFileSync(this.build_directory + "build_options_"+version+".json").toString())
		for ( var o in obj )
			option[o] = obj[o]

		console.log(option)
		return obj

	},
	build_information: JSON.parse(fs.readFileSync(build_dir + "build_information_"+version+".json").toString()),
	build_directory: build_dir,
	wrap_start_file: build_dir + "wrap_start_umd_"+version+".frag",
	wrap_end_file: build_dir + "wrap_end_umd_"+version+".frag",
	wrap_start: fs.readFileSync(build_dir + "wrap_start_umd_"+version+".frag").toString(),
	wrap_end: fs.readFileSync(build_dir + "wrap_end_umd_"+version+".frag").toString(),
}
