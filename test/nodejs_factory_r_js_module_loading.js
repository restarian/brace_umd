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
	method = require(__dirname+"/config/test_method.js"),
	maybe = require("mocha-maybe")

var Spinner = method.Spinner
// Adding node to the command string will help windows know to use node with the file name. The unix shell knows what the #! at the beginning
// of the file is for. The build_umd.js source will run if the spinner command is empty by setting the default_command member.
Spinner.prototype.default_command = "node" 
var build_path = path.join(__dirname, "/../", "/bin", "/build_umd.js") 

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
			expect(require, "nodejs require was mot available").to.be.a("function")
			this.stop = false 
			done()
		})

	})

	describe("nodejs require loading after r_js optimization on modules using the factory", function() {

	  // An array with the values of the test directory is filtered to include all of the files included with the regex.
	  fs.readdirSync(path.join(__dirname, "/config")).filter(function(value) { return RegExp(/^build_config_.*\.json/).test(value) })
	  .forEach(function(value) {

		 value = path.join(__dirname, "/config/", value)
			
		 describe("using config file "+ value + " with r_js", function() {
		
			beforeEach(remove_cache)

			it_might("after building the brace umd source", function(done) {
				// A new umd.js source build is created with the various config files in the test directory.
				new Spinner("", [build_path, "--config-file", value], undefined, function(exit_code) {
					expect(parseInt(exit_code)).to.equal(5)
					done()
				}, function(err) { 
					expect(false, err).to.equal(true); 
					done()
				})
			})

			// The current working directory of npm test commands is the module root which is what process.cwd() returns.
			var example_module_dir = path.join(__dirname, "/..", "/example", "/nodejs/", "/factory")

			it_might("the example module at " + example_module_dir + " will build using the rjs_config.js file and the correct module values will" +
				" load using nodejs require", 
				function(done) {

					new Spinner("r_js", ["-o", path.join(example_module_dir, "/rjs_config.js")], undefined, function() {
						var mod_path = path.join(example_module_dir, "/build", "/entry.js")

						var entry = require(mod_path)
						expect(entry).to.be.an("object").that.nested.include({'module_one.id': "module_one"})
						expect(entry).to.be.an("object").that.nested.include({'second_module.id': "second_module"})

						expect(entry).to.be.an("object").that.nested.include({"entry.id": "entry"})
							.that.deep.nested.include({"entry.module_one": {id: "module_one"}} )

						done()

					}, function() {
					  expect(false).to.equal(true)
					  done()
					})
				})
			})
		})
	})
})
