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

module.paths.unshift(path.join(__dirname, "..", ".."))
var cache = utils.cacheManager(require)
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
	var err_msg = function(msg) {
		expect(false, msg).to.be.true
		done()
	}

	describe("Checking for dependencies:", function() { 

		it("requirejs in available to the module system", function(done) {
			it_will.stop = true 
			expect((function() {try { rjs_path = require.resolve("requirejs"); return true } catch(e) { return e }})(), "could not load the requirejs dependency").to.be.true
			it_will.stop = false 
			done()
		})

		it("the build_umd program is available and at the right location", function(done) {

			it_will.stop = true 
			expect((function() { try { return module.require("brace_umd") }catch(e){} })(), "brace_umd was not found on system").to.be.a("object")
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
		//var config_file = fs.readdirSync(config_dir).filter(function(value) { return /^build_config_.*\.json/.test(value) })
		var config_file = ["build_config_c.json"]

		config_file.forEach(function(value) {
			value = path.join(__dirname, "config", value)
		
			describe("using config file "+ value, function() {

				it("will build the Brace umd source using the build_umd program", function(done) {
					// A new umd.js source build is created with the various config files in the test directory.
					utils.Spawn("node", [build_path, "--config-file", value], undefined, function(exit_code, stdout, stderr) {
						expect(exit_code, "the build_umd script exited with a code other than 0"+stdout+stderr).to.equal(0)
						done()
					}, err_msg)
				})

				// The current working directory of npm test commands is the module root which is what process.cwd() returns.
				var example_module_dir = path.join(__dirname, "example", "nodejs", "amdefine")

				it("the example module at " + example_module_dir + " will build using the rjs_config_auto_anonymous.js file and the correct" +
							" module values will load using amdefine with the make_anonymous option used", function(done) {

					utils.Spawn("node", [rjs_path, "-o", path.join(example_module_dir, "rjs_config_auto_anonymous.js")], undefined, function(exit_code, stdout, stderr) {
						expect(exit_code, "r_js exited with a code other than 0"+stdout+stderr).to.equal(0)
						var define = require("amdefine")(module)
						define([path.join(example_module_dir, "build", "entry.js")], function(entry) {

							expect(entry, stdout+stderr).to.deep.equal({id: "entry", module_one: {id: "module_one"}, second_module: {id: "second_module"}})
							done()
						})
					}, err_msg)
				})

				it("the example module at " + example_module_dir + " will build using the rjs_config_auto_anonymous.js file and the correct" +
							" module values will load using commonjs require with the make_anonymous option used", function(done) {

					utils.Spawn("node", [rjs_path, "-o", path.join(example_module_dir, "rjs_config_auto_anonymous.js")], undefined, function(exit_code, stdout, stderr) {

						expect(exit_code, "r_js exited with a code other than 0"+stdout+stderr).to.equal(0)
						var entry = require(path.join(example_module_dir, "build", "entry.js"))

						expect(entry).to.deep.equal({id: "entry", module_one: {id: "module_one"}, second_module: {id: "second_module"}})
						done()
					}, err_msg)
				})

				it("the example module at " + example_module_dir + " will build using the rjs_config.js file and the correct module values will" +
							" load using amdefine", function(done) {

					utils.Spawn("node", [rjs_path, "-o", path.join(example_module_dir, "rjs_config.js")], undefined, function(exit_code, stdout, stderr) {
						
						expect(exit_code, "r_js exited with a code other than 0"+stdout+stderr).to.equal(0)
						var define = require("amdefine")(module)

						define([path.join(example_module_dir, "build", "entry.js")], function(entry) {

							// There is no way to retrieve the module data if all id's were used via amdefine so it should return an empty Object to
							// show that everything went well.
							expect(entry).to.deep.equal({})
							done()
						})
					}, err_msg)
				})
			})
		})
	})
})
