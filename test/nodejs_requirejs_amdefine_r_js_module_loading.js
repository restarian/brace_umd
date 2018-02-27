/* MIT License
Copyright (c) 2018 Robert Edward Steckroth

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

 Author: Robert Edward Steckroth, Bustout, <RobertSteckroth@gmail.com> */

var expect = require("chai").expect,
	path = require("path"),
	fs = require("fs"),
	utils = require("bracket_utils"),
	maybe = require("brace_maybe")

var cache = utils.cacheManager(require)
module.paths.unshift(path.join(__dirname, "..", ".."))
var it_will = global

describe("Using stop further progression methodology for file dependencies: "+path.basename(__filename), function() { 

	// The stop property of the first describe enclosure is used to control test skipping.
	var it = maybe(it_will)	
	it_will.stop = !!process.env.DRY_RUN  
	it_will.quiet = !!process.env.QUIET

	var build_path = path.join(__dirname, "..", "bin", "build_umd.js"),
		config_dir = path.join(__dirname, "config"),
		rjs_path

	beforeEach(cache.start.bind(cache))
	afterEach(cache.dump.bind(cache))
	describe("Checking for dependencies:", function() { 

		it("requirejs in available to the module system", function(done) {
			it_will.stop = true 
			expect((function() {try { rjs_path = require.resolve("requirejs"); return true } catch(e) { return e }})(), "could not load the requirejs dependency").to.be.true
			it_will.stop = false 
			done()
		})

		it("the build_umd program is available and at the right location", function(done) {
			it_will.stop = true 
			expect((function() { try { return require("brace_umd") }catch(e){} })(), "brace_umd was not found on system").to.be.a("object")
			expect(fs.existsSync(build_path), "could not find the build_umd.js program").to.be.true
			expect(build_path, "the expected path of the build_umd program is not the one located by the unit test")
						.to.equal(require("brace_umd").build_program_path)
			it_will.stop = false 
			done()
		})

		it("has all module dependencies available", function(done) {

			it_will.stop = true 
			expect((function() { try { return require("amdefine")(module) }catch(e){} })(), "amdefine was not found on system").to.be.a("function")
				.that.have.property("require")
			it_will.stop = false 
			done()
		})

	})

	describe("Requirejs module loading after using r_js optimization on amdefined modules", function() {

		// An array with the values of the test directory is filtered to include all of the files included with the regex.
		var config_file = fs.readdirSync(config_dir).filter(function(config_path) { return /^build_config_.*\.json/.test(config_path) })
		config_file.forEach(function(config_path) {
			config_path = path.join(__dirname, "config", config_path)
		
			describe("using config file "+ config_path, function() {

				it("after building the brace umd source", function(done) {
					// A new umd.js source build is created with the various config files in the test directory.
					utils.Spawn("node", [build_path, "--config-file", config_path], undefined, (exit_code, stdout, stderr) => {
						expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)
						done()
					}, function(err) { 
						expect(false).to.equal(true) 
						done()
					})
				})

				// The current working directory of npm test commands is the module root which is what process.cwd() returns.
				var example_module_dir = path.join(__dirname, "example", "nodejs", "requirejs_amdefine")

				it("the example module at " + example_module_dir + " will build using the rjs_config.js file and the correct module values will" +
							" load using requirejs", function(done) {

					utils.Spawn("node", [rjs_path, "-o", path.join(example_module_dir, "rjs_config.js")], undefined, (exit_code, stdout, stderr) => {
						expect(exit_code, "r_js exited with a code other than 0").to.equal(0)

						this.log_stdout = true

						var requirejs = require("requirejs")
						
						// Set the baseUrl to the build directory so that any modules not found there will be loaded via the node require instead (which
						// is requirejs best practice).
						requirejs.config({baseUrl: path.join(example_module_dir, "build"), nodeRequire: require})
						// Load the r.js optimized module which contains the dependencies module_one.js and second_module.
						requirejs(["require", "entry"], function(req, mod) { 
							var mod_two = req("second_module")
							expect(mod_two).to.deep.equal({ id: "second_module" })
							done()
						})

					}, function(err) {
					  expect(false, err).to.equal(true)
					  done()
					})
				})

				it("the example module at " + example_module_dir + " will build using the rjs_config.js file and the correct module values will" +
							" load using amdefine", function(done) {

					utils.Spawn("node", [rjs_path, "-o", path.join(example_module_dir, "rjs_config.js")], undefined, (exit_code, stdout, stderr) => {
						expect(exit_code, "r_js exited with a code other than 0").to.equal(0)

						this.log_stdout = true

						var define = require("amdefine")(module)
						
						define(["require", path.join(example_module_dir, "build", "entry")], function(req, mod) { 
							expect(mod).to.deep.equal({ id: "entry" })
							done()
						})

					}, function(err) {
					  expect(false, err).to.equal(true)
					  done()
					})
				})

				it("the example module at " + example_module_dir + " will build using the rjs_config.js file and the correct module values will" +
							" load using amdefine", function(done) {

					utils.Spawn("node", [rjs_path, "-o", path.join(example_module_dir, "rjs_config.js")], undefined, (exit_code, stdout, stderr) => {
						expect(exit_code, "r_js exited with a code other than 0").to.equal(0)

						var define = require("amdefine")(module)
						
						define(["require", path.join(example_module_dir, "build", "entry")], function(req, mod) { 
							expect(mod).to.deep.equal({ id: "entry" })
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
