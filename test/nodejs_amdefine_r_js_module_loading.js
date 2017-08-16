/*
Copyright (c) 2017 Robert Edward Steckroth

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

var expect = require("chai").expect,
	spawn = require("child_process").exec,
	path = require("path"),
	fs = require("fs"),
	method = require("./config/test_method.js")

var Spinner = method.Spinner

var remove_cache = function() {

	// The amdefine module need to be reloaded again so that the previous module data which is stored in the amdefine loader cache will be removed.
	// All subsequent tests after the first one to verify if modules are available would pass or fail if the amdefine loader cache was not removed.
	for ( var id in require.cache )
	  if ( path.parse(id).base === "entry.js" || path.parse(id).base === "amdefine.js" )
	    delete require.cache[id]
}

describe("Checking test file dependencies..", function() { 

	expect(require("requirejs")).to.not.be.a("undefined")
	remove_cache()

})

describe("Requirejs module loading after using r_js optimization on amdefined modules", function() {

  // An array with the values of the test directory is filtered to include all of the files included with the regex.
  var config_file = fs.readdirSync("test/config").filter(function(value) { return RegExp(/^build_config_.*\.json/).test(value) })
  config_file.forEach(function(value) {
    value = path.join("test/config/", value)
	
    describe("using config file "+ value, function() {

		// Remove the amdefine and module cache from the testing module.
		afterEach(remove_cache)

		it("after building the brace umd source", function(done) {
			// A new umd.js source build is created with the various config files in the test directory.
			new Spinner("", ["--config-file", value], undefined, function(exit_code) {
				console.log(this.stdout, this.stderr)
				expect(parseInt(exit_code)).to.equal(5); done()
			}, function(err) { 
				expect(false).to.equal(true); 
				done()
			})
		})

		// The current working directory of npm test commands is the module root which is what process.cwd() returns.
		example_module_dir = path.join(process.cwd(), "/example", "/nodejs/", "/amdefine")

		it("the example module at " + example_module_dir + " will build using the rjs_config.js file and the correct module values will" +
			" load using amdefine", 
			function(done) {
				new Spinner("r_js", ["-o", path.join(example_module_dir, "/rjs_config.js")], undefined, function() {

					//var define = require("amdefine")(module)
					var requirejs = require("requirejs")
					requirejs.config({nodeRequire: require})

					var mod_path = path.join(example_module_dir, "/build", "/entry.js")

					// Load the r.js optimized module which contains the dependencies module_one.js and second_module.
					requirejs(["require", mod_path], 
						function(req) {
							var mod_one = req("module_one")
							var mod_two = req("second_module")
							var entry = req("entry")

							expect(mod_one).to.be.an("object")
							expect(mod_one).to.deep.equal({ id: "module_one" })

							expect(mod_two).to.be.an("object")
							expect(mod_two).to.deep.equal({ id: "second_module" })

							expect(entry).to.be.an("object")
							expect(entry).to.deep.equal({ id: "entry", module_one: { id: "module_one" }, second_module: { id: "second_module" } })

							done()
					})

				}, function() {
				  expect(false).to.equal(true)
				  done()
				})
			})
		})
	})
})
