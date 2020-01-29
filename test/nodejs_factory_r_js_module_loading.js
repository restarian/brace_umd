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
			expect((function() { try { return require("brace_umd") }catch(e){ return e } })(), "brace_umd was not found on system").to.be.a("object")
			expect(fs.existsSync(build_path), "could not find the build_umd.js program").to.be.true
			expect(build_path, "the expected path of the build_umd program is not the one located by the unit test")
						.to.equal(require("brace_umd").build_program_path)
			it_will.stop = false 
			done()
		})

		/*
		it("has all module dependencies available", function(done) {
			it_will.stop = true 
			expect((function() { try { return require("amdefine")(module) }catch(e){ return e} })(), "amdefine was not found on system").to.be.a("function")
				.that.have.property("require")
			it_will.stop = false 
			done()
		})
		*/

	})

	describe("nodejs require loading after r_js optimization on modules using the factory", function() {

	  // An array with the values of the test directory is filtered to include all of the files included with the regex.
		fs.readdirSync(config_dir)
		.filter(function(config_path) { return /^build_config_.*\.json/.test(config_path) }).forEach(function(config_path) {

			config_path = path.join(config_dir, config_path)
			
			describe("using config file "+ config_path + " with r_js", function() {
		
				it("after building the brace umd source", function(done) {
					// A new umd.js source build is created with the various config files in the test directory.
					utils.Spawn("node", [build_path, "--config-file", config_path, "--compress"], undefined, (exit_code, stdout, stderr) => {
						expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)
						done()
					}, function(err) { expect(false, err).to.equal(true); done() })
				})

				// The current working directory of npm test commands is the module root which is what process.cwd() returns.
				var example_module_dir = path.join(__dirname, "example", "nodejs/", "factory")

				it("the example module at " + example_module_dir + " will build using the rjs_config_force_factory.js file with force type of factory" +
							" and the correct module values will load using commonjs require", function(done) {

					utils.Spawn("node", [rjs_path, "-o", path.join(example_module_dir, "rjs_config_force_factory.js")], undefined, (exit_code, stdout, stderr) => {
						expect(exit_code, "r_js exited with a code other than 0").to.equal(0)

						var module_path = path.join(example_module_dir, "build", "entry.js")
						var base_path = path.join(example_module_dir, "build", "base_module.js")
						var entry = require(module_path)

						expect(entry).to.nested.include({'module_one.id': "module_one"})
						expect(entry).to.nested.include({'second_module.id': "second_module"})
						expect(entry).to.include.key({"id": "entry"})

						var base = require(base_path)
						expect(base).to.be.a("function").that.includes({'id': "base_module"})

						done()

					}, function(err) { expect(false, err).to.equal(true); done() })
				})

				it("the example module at " + example_module_dir + " will build using the rjs_config_force_factory_auto_anonymous.js" +
									 "file with force type of factory and the correct module values will load using commonjs require", function(done) {

					utils.Spawn("node", [rjs_path, "-o", path.join(example_module_dir, "rjs_config_force_factory_auto_anonymous.js")], undefined, (exit_code, stdout, stderr) => {
						expect(exit_code, "r_js exited with a code other than 0").to.equal(0)
						
						var entry_path = path.join(example_module_dir, "build", "entry.js")
						var base_path = path.join(example_module_dir, "build", "base_module.js")
						
						var entry = require(entry_path)
						var base = require(base_path)
						
						expect(base).to.be.a("function").that.includes({'id': "base_module"})

						expect(entry).to.nested.include({'module_one.id': "module_one"})
						expect(entry).to.nested.include({'second_module.id': "second_module"})
						expect(entry).to.include.key({"id": "entry"})

						// remove all of the amd definitions from the cache and any loaded example modules.
						cache.dump()

						// load the original base_module example specified with example_module_dir.
						var base_path = path.join(example_module_dir, "build", "base_module.js")
						var base = require(base_path)

						expect(base).to.be.a("function").that.includes({'id': "base_module"})

						cache.dump()
	
						base_path = path.join(example_module_dir, "build", "base_module.js")
						var module_text = fs.readFileSync(base_path)
						expect(module_text).to.be.a.instanceof(Buffer)

						base_path = path.join(example_module_dir, "build", "base_module_mutated.js")
						// This regex will strip out the id string from the base module definition which can happen when the UMD script is manually used (
						// without requirejs optimizer).
						fs.writeFileSync(base_path, module_text.toString().replace(/define\([\n,\r,\s]*[\",\']base_module[\",\'][\s]*,[\s]*/, "define("))
						
						var base = require(base_path)
						expect(base).to.be.a("function").that.includes({'id': "base_module"})

						done()

					}, function(err) { expect(false, err).to.equal(true); done() })
				})

			})
		})
	})
})
