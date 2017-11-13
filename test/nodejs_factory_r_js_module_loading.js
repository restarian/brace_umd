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
	remove_cache = test_help.remove_cache.bind(null, "brace_umd.js", "entry.js", "stand_alone_factory.js")

// Adding node to the command string will help windows know to use node with the file name. The unix shell knows what the #! at the beginning
// of the file is for. The build_umd.js source will run if the spinner command is empty by setting the default_command member.
Spinner.prototype.default_command = "node" 
Spinner.prototype.log_stdout = true 
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
					new Spinner("", [build_path, "--config-file", config_path], undefined, function(exit_code) {
						expect(parseInt(exit_code)).to.equal(5)
						done()
					})
				})

				// The current working directory of npm test commands is the module root which is what process.cwd() returns.
				var example_module_dir = path.join(__dirname, "/..", "/example", "/nodejs/", "/factory")

				it_might("the example module at " + example_module_dir + " will build using the rjs_config.js file with force type of factory" +
							" and the correct module values will load using commonjs require.", function(done) {

					new Spinner("", [path.join(__dirname, "/../", "/node_modules", "/requirejs", "/bin", "/r.js"), 
									"-o", path.join(example_module_dir, "/rjs_config_force_factory.js")], undefined, function() {

						var module_path = path.join(example_module_dir, "/build", "/entry.js")
						var entry = require(module_path)
						expect(entry).to.nested.include({'module_one.id': "module_one"})
						expect(entry).to.nested.include({'second_module.id': "second_module"})
						expect(entry).to.include.key("entry")

						done()

					}, function() {
					  expect(false).to.equal(true)
					  done()
					})
				})

				it_might("A stand-alone factory implementation will return the correct data", function(done) {

					// This will re-build the umd source with the config file but also keep the drop_console option to false to that the intercept-stdout 
					// can be tested against what is logged in the non-minified source.

					new Spinner("", [build_path, "--config-file", config_path, "--compress", "drop_console=false"], undefined, function(exit_code) {
	
						var umd = require("../")
						var module_path = path.join(example_module_dir, "/stand_alone_factory.js")
						var non_wrapped_path = path.join(example_module_dir, "/non_wrapped_factory.js")
						var module_text = fs.readFileSync(non_wrapped_path)
						expect(module_text).to.be.a.instanceof(Buffer)
						fs.writeFileSync(module_path, umd.wrap_start + module_text.toString() + umd.wrap_end_option({force_type: "factory"}))
						var captured_text = ""
						var unhook_intercept = intercept(function(txt) { captured_text += txt })
						var entry = require(module_path)
						unhook_intercept()
						expect(captured_text).to.include("Forcing use of the definition type factory")
						expect(entry).to.nested.include({'first.id': "first"})
						expect(entry).to.nested.include({'second.id': "second"})
						expect(entry).to.include.key(path.basename(module_path))
						done()

					}, function() {
					  expect(false).to.equal(true)
					  done()
					})
				})

				it_might("A stand-alone factory implementation will output the correct error message and not load the module" +
								  " if a non-available dependency is specified", function(done) {

					// This will re-build the umd source with the config file but also keep the drop_console option to false to that the intercept-stdout 
					new Spinner("", [build_path, "--config-file", config_path, "--compress", "drop_console=false"], undefined, function(exit_code) {
	
						var umd = require("../")
						var module_path = path.join(example_module_dir, "/stand_alone_factory.js")
						var non_wrapped_path = path.join(example_module_dir, "/non_wrapped_factory_unavailable_dependency.js")
						var module_text = fs.readFileSync(non_wrapped_path)
						expect(module_text).to.be.a.instanceof(Buffer)
						fs.writeFileSync(module_path, umd.wrap_start + module_text.toString() + umd.wrap_end_option({force_type: "factory"}))
						var captured_text = ""
						var unhook_intercept = intercept(function(txt) { captured_text += txt })
						var entry = require(module_path)
						unhook_intercept()
						expect(captured_text).to.include("Forcing use of the definition type factory")
						expect(captured_text).to.include("is not loaded into the factory")
						expect(entry).to.nested.include({'first.id': "first"})
						expect(entry).to.nested.include({'second.id': "second"})
						expect(entry).to.not.include.key(path.basename(module_path))

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
