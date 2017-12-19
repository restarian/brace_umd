/* MIT License
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
	intercept = require("intercept-stdout"),
	maybe = require("brace_maybe")

var Spinner = test_help.Spinner,
	remove_cache = test_help.remove_cache.bind(null, "brace_umd.js", "entry.js", "base_module.js", "amdefine.js", "r.js")

// Adding node to the command string will help windows know to use node with the file name. The unix shell knows what the #! at the beginning
// of the file is for. The build_umd.js source will run if the spinner command is empty by setting the default_command member.
Spinner.prototype.default_command = "node" 
Spinner.prototype.log_stdout = true 
Spinner.prototype.log_stderr = true 
Spinner.prototype.log_err = true 

module.paths.unshift(path.join(__dirname, "/..", "/../"))

var build_path = path.join(__dirname, "/..", "/bin", "/build_umd.js"),
	config_dir = path.join(__dirname, "/config")
	//	rjs_path

describe("Using stop further progression methodology for file dependencies: "+path.basename(__filename), function() { 

	beforeEach(remove_cache)

	// The stop property of the first describe enclosure is used to control test skipping.
	this.stop = false
	var it_might = maybe(this)	

	describe("Checking for dependencies:", function() { 
/*
		it_might("r_js in the system as a program", function(done) {
			this.stop = true 
			expect(fs.existsSync(rjs_path = require.resolve("requirejs")), "could not find r.js dependency").to.be.true
			this.stop = false 
			done()
		})
*/

		it_might("the build_umd program is available and at the right location", function(done) {
			this.stop = true 
			expect((function() { try { return require("brace_umd") }catch(e){} })(), "brace_umd was not found on system").to.be.a("object")
			expect(fs.existsSync(build_path), "could not find the build_umd.js program").to.be.true
			expect(build_path, "the expected path of the build_umd program is not the one located by the unit test")
						.to.equal(require("brace_umd").build_program_path)
			this.stop = false 
			done()
		})

/*
		it_might("has all module dependencies available", function(done) {

			this.stop = true 
			expect((function() { try { return require("amdefine")(module) }catch(e){} })(), "amdefine was not found on system").to.be.a("function")
				.that.have.property("require")
			remove_cache()
			this.stop = false 
			done()
		})
*/

	})

	describe("nodejs require loading after r_js optimization on modules using the factory", function() {

		fs.readdirSync(config_dir)
		// An array with the values of the test directory is filtered to include all of the files included with the regex.
		.filter(function(config_path) { return /^build_config_.*\.json/.test(config_path) }).forEach(function(value) {

			value = path.join(config_dir, value)
		
			describe("using config file "+ value, function() {

				it_might("after building the brace umd source", function(done) {

					// This will re-build the umd source with the config file but also keep the drop_console option to false to that the intercept-stdout 
					// can be tested against what is logged in the non-minified source.
					new Spinner("", [build_path, "--config-file", value, "--compress", "drop_console=false"], undefined, function(exit_code) {
						expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)
						done()
					}, function(err) { 
						expect(false).to.equal(true); 
						done()
					})
				})


				// The current working directory of npm test commands is the module root which is what process.cwd() returns.
				var example_module_dir = path.join(__dirname, "/..", "/example", "/nodejs/", "/factory")

				it_might("A non-requirejs-optimized factory implementation with and without the auto_anonymous option set will return the correct data" +
							  " when using only a callback as the definition parameter", function(done) {

					var umd = require("brace_umd")
					var non_wrapped_path = path.join(example_module_dir, "/stand_alone_factory_a.js")
					var module_text = fs.readFileSync(non_wrapped_path)

					var module_path_a = path.join(example_module_dir, "/build", "/stand_alone_factory_a.js")
					var module_path_b = path.join(example_module_dir, "/build", "/stand_alone_factory_b.js")

					expect(module_text).to.be.a.instanceof(Buffer)
					fs.writeFileSync(module_path_a, umd.wrap_start + module_text.toString() + umd.wrap_end_option({force_type: "factory", auto_anonymous: false}))
					fs.writeFileSync(module_path_b, umd.wrap_start + module_text.toString() + umd.wrap_end_option({force_type: "factory", auto_anonymous: true}))

					var captured_text = ""
					var unhook_intercept = intercept(function(txt) { captured_text += txt })
					var module_one = require(module_path_a)
					var module_two = require(module_path_b)
					unhook_intercept()
					
					expect(captured_text).to.include("Forcing use of the definition type factory")

					expect(module_one).to.not.have.key("first")
					expect(module_one).to.not.have.key("second")
					expect(module_one).to.have.any.key("id")
					expect(module_one).to.have.any.key("require")
					expect(module_one.require).to.be.undefined

					expect(module_two).to.not.have.key("first")
					expect(module_two).to.not.have.key("second")
					expect(module_two).to.have.any.key("id")
					expect(module_two).to.have.any.key("require")
					expect(module_two.require).to.be.undefined

					remove_cache("stand_alone_factory_a.js", "stand_alone_factory_b.js")
					done()

				})

				it_might("A non-requirejs-optimized factory implementation without the auto_anonymous option set will return the correct data", function(done) {

					var umd = require("brace_umd")
					var non_wrapped_path = path.join(example_module_dir, "/stand_alone_factory.js")
					var module_path = path.join(example_module_dir, "/build", "/stand_alone_factory.js")
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
					expect(entry).to.include({'id': "stand_alone"})

					remove_cache("stand_alone_factory.js")
					done()

				})

				it_might("A non-requirejs-optimized factory implementation will output the correct error message and not load the module" +
								  " if a unavailable dependency is specified", function(done) {

					var umd = require("brace_umd")
					var non_wrapped_path = path.join(example_module_dir, "/stand_alone_factory_unavailable_dependency.js")
					var module_path = path.join(example_module_dir, "/build", "/stand_alone_factory_unavailable_dependency.js")
					var module_text = fs.readFileSync(non_wrapped_path)
					expect(module_text).to.be.a.instanceof(Buffer)
					fs.writeFileSync(module_path, umd.wrap_start + module_text.toString() + umd.wrap_end_option({force_type: "factory"}))

					var captured_text = ""
					var unhook_intercept = intercept(function(txt) { captured_text += txt })
					var entry = require(module_path)
					unhook_intercept()

					expect(captured_text).to.include("Forcing use of the definition type factory")
					expect(captured_text).to.include("The dependency nope is not loaded into the factory. Skipping loading of the anonymous module")
					expect(entry).to.nested.include({'first.id': "first"})
					expect(entry).to.nested.include({'second.id': "second"})
					expect(entry).to.not.include.key("id")

					remove_cache("stand_alone_factory_unavailable_dependency.js")
					done()

				})
			})
		})
	})
})
