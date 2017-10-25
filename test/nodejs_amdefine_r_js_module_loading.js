/*
MIT License
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
	path = require("path"),
	fs = require("fs"),
	test_help = require("test_help"),
	maybe = require("mocha-maybe")

var Spinner = test_help.Spinner,
	remove_cache = test_help.remove_cache.bind(null, "entry.js", "amdefine.js")

// Adding node to the command string will help windows know to use node with the file name. The unix shell knows what the #! at the beginning
// of the file is for. The build_umd.js source will run if the spinner command is empty by setting the default_command member.
Spinner.prototype.default_command = "node" 
Spinner.prototype.log_stdout = true 

var build_path = path.join(__dirname, "/../", "/bin", "/build_umd.js") 
var config_dir = path.join(__dirname, "/config") 

describe("Using stop further progression methodology for file dependencies: "+path.basename(__filename), function() { 

	// The stop property of the first describe enclosure is used to control test skipping.
	this.stop = false
	var it_might = maybe(this)	

	describe("Checking for dependencies:", function() { 

		it_might("finds r_js in the system as a program", function(done) {

			this.stop = true 
			expect(fs.existsSync(path.join(__dirname, "/../", "/node_modules", "/requirejs", "/bin", "/r.js")), "could not find r.js dependency").to.be.true
			this.stop = false 
			done()
		})

		it_might("has all module dependencies available", function(done) {

			this.stop = true 
			expect(require("amdefine")(module), "amdefine was not found on system").to.be.a("function").that.have.property("require")
			remove_cache()
			this.stop = false 
			done()
		})

	})

	describe("Requirejs module loading after using r_js optimization on amdefined modules", function() {

		// An array with the values of the test directory is filtered to include all of the files included with the regex.
		var config_file = fs.readdirSync(config_dir).filter(function(value) { return /^build_config_.*\.json/.test(value) })
		config_file.forEach(function(value) {
			value = path.join(__dirname, "/config/", value)
		
			describe("using config file "+ value, function() {

				// Remove the amdefine and module cache from the testing module.
				beforeEach(remove_cache)

				it_might("will build the Brace umd source using the build_umd program", function(done) {
					// A new umd.js source build is created with the various config files in the test directory.
					new Spinner("", [build_path, "--config-file", value], undefined, function(exit_code) {
						expect(exit_code).to.equal(5)
						done()
					}, function(err) { 
						expect(false).to.equal(true); 
						done()
					})
				})

				// The current working directory of npm test commands is the module root which is what process.cwd() returns.
				var example_module_dir = path.join(__dirname, "/../", "/example", "/nodejs/", "/amdefine")

				it_might("the example module at " + example_module_dir + " will build using the rjs_config_auto_anonymous.js file and the correct" +
							" module values will load using amdefine with the make_anonymous option used", function(done) {

					new Spinner("", [path.join(__dirname, "/../", "/node_modules", "/requirejs", "/bin", "/r.js"), 
										  "-o", path.join(example_module_dir, "/rjs_config_auto_anonymous.js")], undefined, function() {

						var define = require("amdefine")(module)
						define([path.join(example_module_dir, "/build", "/entry.js")], function(entry) {

							expect(entry).to.deep.equal({id: "entry", module_one: {id: "module_one"}, second_module: {id: "second_module"}})
							done()
						})

					}, function(err) {
					  expect(false, err).to.equal(true)
					  done()
					})
				})

				it_might("the example module at " + example_module_dir + " will build using the rjs_config_auto_anonymous.js file and the correct" +
							" module values will load using commonjs require with the make_anonymous option used", function(done) {

					new Spinner("", [path.join(__dirname, "/../", "/node_modules", "/requirejs", "/bin", "/r.js"), 
										  "-o", path.join(example_module_dir, "/rjs_config_auto_anonymous.js")], undefined, function() {

						var entry = require(path.join(example_module_dir, "/build", "/entry.js"))
						expect(entry).to.deep.equal({id: "entry", module_one: {id: "module_one"}, second_module: {id: "second_module"}})
						done()

					}, function(err) {
					  expect(false, err).to.equal(true)
					  done()
					})
				})

				it_might("the example module at " + example_module_dir + " will build using the rjs_config.js file and the correct module values will" +
							" load using amdefine", function(done) {

					new Spinner("node", [path.join(__dirname, "/../", "/node_modules", "/requirejs", "/bin", "/r.js"), 
												"-o", path.join(example_module_dir, "/rjs_config.js")], undefined, function() {

						var define = require("amdefine")(module)
						define([path.join(example_module_dir, "/build", "/entry.js")], function(entry) {

							// There is no way to retrieve the module data if all id's were used via amdefine so it should return an empty Object to
							// show that everything went well.
							expect(entry).to.deep.equal({})
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
