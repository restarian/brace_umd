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
	method = require("process-wrap"),
	maybe = require("mocha-maybe")

var Spinner = method.Spinner
// Adding node to the command string will help windows know to use node with the file name. The unix shell knows what the #! at the beginning
// of the file is for. The build_umd.js source will run if the spinner command is empty by setting the default_command member.
Spinner.prototype.default_command = "node" 
var build_path = path.join(__dirname, "/../", "/bin", "/build_umd.js") 
var config_dir = path.join(__dirname, "/config") 

var remove_cache = function() {

	// The amdefine module need to be reloaded again so that the previous module data which is stored in the amdefine loader cache will be removed.
	// All subsequent tests after the first one to verify if modules are available would pass or fail if the amdefine loader cache was not removed.
	for ( var id in require.cache ) 
	  if ( path.basename(id) === "entry.js" || path.basename(id) === "r.js" ) 
	    delete require.cache[id]
}

describe("Using stop further progression methodology for file dependencies: "+path.basename(__filename), function() { 

	// The stop property of the first describe enclosure is used to control test skipping.
	this.stop = false
	var it_might = maybe(this)	

	describe("Checking for dependencies:", function() { 

		it_might("finds r_js in the system as a program", function(done) {

			var This = this
			new Spinner("r_js", [], undefined, function() {
				done()
			}, function(err) {
				This.stop = true 
				expect(false).to.equal(true)
				done()
			})
		})

		it_might("has all module dependencies available", function(done) {

			this.stop = true 
			expect(require("requirejs"), "requirejs was not found on system").to.be.a("function").that.have.property("config")
			remove_cache()
			this.stop = false 
			done()
		})

	})

	describe("Requirejs module loading after using r_js optimization on amdefined modules", function() {

	  // An array with the values of the test directory is filtered to include all of the files included with the regex.
	  var config_file = fs.readdirSync(path.join(__dirname, "/config")).filter(function(value) { return RegExp(/^build_config_.*\.json/).test(value) })
	  config_file.forEach(function(value) {
		 value = path.join(config_dir, value)
		
		 describe("using config file "+ value, function() {

			// Remove the amdefine and module cache from the testing module.
			beforeEach(remove_cache)

			it_might("after building the brace umd source", function(done) {
				// A new umd.js source build is created with the various config files in the test directory.
				new Spinner("node", [build_path, "--config-file", value], undefined, function(exit_code) {
					done()
				}, function(err) { 
					expect(false).to.equal(true); 
					done()
				})
			})

			// The current working directory of npm test commands is the module root which is what process.cwd() returns.
			var example_module_dir = path.join(__dirname, "/../", "/example", "/nodejs/", "/requirejs_amdefine")

			it_might("the example module at " + example_module_dir + " will build using the rjs_config.js file and the correct module values will" +
				" load using amdefine", 
				function(done) {
					new Spinner("r_js", ["-o", path.join(example_module_dir, "/rjs_config.js")], undefined, function() {

						var requirejs = require("requirejs")
						requirejs.config({baseUrl: path.join(example_module_dir, "/build"), nodeRequire: require})

						var mod_path = path.join(example_module_dir, "/build", "/entry.js")

						// Load the r.js optimized module which contains the dependencies module_one.js and second_module.
						requirejs(["require", mod_path], 
							function(req, mod) {
								console.log(mod)
								done()
						})

					}, function(err) {
					  expect(false, err).to.equal(true)
					  done()
					})
				})
			})
		})
	})
})
