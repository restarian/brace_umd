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

var expect = require("chai").expect
	path = require("path"),
	fs = require("fs"),
	test_help = require("test_help"),
	maybe = require("mocha-maybe"),
	intercept = require("intercept-stdout")

var Spinner = test_help.Spinner,
	remove_cache = test_help.remove_cache.bind(null, "amdefine.js", "r.js", "brace_umd.js")

// Adding node to the command string will help windows know to use node with the file name. The unix shell knows what the #! at the beginning
// of the file is for. The build_umd.js source will run if the spinner command is empty by setting the default_command member.
Spinner.prototype.default_command = "node" 
Spinner.prototype.log_stdout = false 
Spinner.prototype.log_stderr = true 
Spinner.prototype.log_err = true 

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
			expect(require, "commonjs module require is not available").to.be.a("function")
			this.stop = false 
			done()
		})

	})

	describe("nodejs require loading after r_js optimization on modules using the factory", function() {

	  // An array with the values of the test directory is filtered to include all of the files included with the regex.
		fs.readdirSync(config_dir)
		.filter(function(config_path) { return /^build_config_.*\.json/.test(config_path) }).forEach(function(config_path) {

			config_path = path.join(config_dir, config_path)
			
			describe("using config file "+ config_path + " with r_js", function() {
		
				beforeEach(remove_cache)

				it_might("after building the brace umd source", function(done) {
					// A new umd.js source build is created with the various config files in the test directory.
					new Spinner("", [build_path, "--config-file", config_path, "--compress", "drop_console=false"], undefined, function(exit_code) {
						expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)
						done()
					}, function(err) { 
						expect(false).to.equal(true); 
						done()
					})
				})

				// The current working directory of npm test commands is the module root which is what process.cwd() returns.
				var example_module_dir = path.join(__dirname, "/..", "/example", "/nodejs/", "/factory")

				it_might("the example module at " + example_module_dir + " will build using the rjs_config_force_factory.js file with force type of factory" +
							" and the correct module values will load using commonjs require.", function(done) {

					new Spinner("", [path.join(__dirname, "/../", "/node_modules", "/requirejs", "/bin", "/r.js"), 
									"-o", path.join(example_module_dir, "/rjs_config_force_factory.js")], undefined, function(exit_code) {

						expect(exit_code, "r_js exited with a code other than 0").to.equal(0)

						var module_path = path.join(example_module_dir, "/build", "/entry.js")
						var base_path = path.join(example_module_dir, "/build", "/base_module.js")
						var entry = require(module_path)

						expect(entry).to.nested.include({'module_one.id': "module_one"})
						expect(entry).to.nested.include({'second_module.id': "second_module"})
						expect(entry).to.include.key({"id": "entry"})

						var base = require(base_path)
						expect(base).to.be.a("function").that.includes({'id': "base_module"})

						done()

					}, function() {
					  expect(false).to.equal(true)
					  done()
					})
				})

				it_might("the example module at " + example_module_dir + " will build using the rjs_config_force_factory_auto_anonymous.js" +
									 "file with force type of factory and the correct module values will load using commonjs require.", function(done) {

					new Spinner("", [path.join(__dirname, "/../", "/node_modules", "/requirejs", "/bin", "/r.js"), 
									"-o", path.join(example_module_dir, "/rjs_config_force_factory_auto_anonymous.js")], undefined, function(exit_code) {
									//"-o", path.join(example_module_dir, "/rjs_config_force_factory_auto_anonymous.js")], undefined, function() {

						expect(exit_code, "r_js exited with a code other than 0").to.equal(0)
						
						var entry_path = path.join(example_module_dir, "/build", "/entry.js")
						var base_path = path.join(example_module_dir, "/build", "/base_module.js")
						
						// Load the build (requirejs optimized), versions of the example modules specified with example_module_dir.
						var entry = require(entry_path)
						var base = require(base_path)
						
						expect(base).to.be.a("function").that.includes({'id': "base_module"})

						expect(entry).to.nested.include({'module_one.id': "module_one"})
						expect(entry).to.nested.include({'second_module.id': "second_module"})
						expect(entry).to.include.key({"id": "entry"})

						// remove all of the amd definitions from the cache and any loaded example modules.
						remove_cache("entry.js", "base_module.js")

						// load the original base_module example specified with example_module_dir.
						var base_path = path.join(example_module_dir, "/base_module.js")
						var base = require(base_path)

						expect(base).to.be.a("function").that.includes({'id': "base_module"})

						remove_cache("entry.js", "base_module.js")
	
						base_path = path.join(example_module_dir, "/build", "/base_module.js")
						var module_text = fs.readFileSync(base_path)
						expect(module_text).to.be.a.instanceof(Buffer)

						base_path = path.join(example_module_dir, "/build", "/base_module_mutated.js")
						// This regex will strip out the id string from the base module definition which can happen when the UMD script is manually used (
						// without requirejs optimizer).
						fs.writeFileSync(base_path, module_text.toString().replace(/define\([\n,\r,\s]*[\",\']base_module[\",\'][\s]*,[\s]*/, "define("))
						
						var base = require(base_path)
						expect(base).to.be.a("function").that.includes({'id': "base_module"})

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
