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

 Author: Robert Edward Steckroth II, Bustout, <RobertSteckroth@gmail.com> */

var expect = require("chai").expect,
	path = require("path"),
	fs = require("fs"),
	utils = require("bracket_utils"),
	maybe = require("brace_maybe")

var Spawner = utils.Spawner,
	remove_cache = utils.remove_cache.bind(null, "brace_umd.js", "base_module.js", "amdefine.js", "r.js", "factory.js", "factory_a.js", "factory_b.js")

Spawner.prototype.log_stdout = false 
Spawner.prototype.log_stderr = true 
Spawner.prototype.log_err = true 

module.paths.unshift(path.join(__dirname, "/..", "/../"))

var build_path = path.join(__dirname, "/..", "/bin", "/build_umd.js"),
	config_dir = path.join(__dirname, "/config")

describe("Using stop further progression methodology for file dependencies: "+path.basename(__filename), function() { 

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

					new Spawner("node", [build_path, "--config-file", value, "--compress"], undefined, function(exit_code) {
						expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)
						done()
					}, function(err) { 
						expect(false).to.equal(true); 
						done()
					})
				})

				describe("a non-requirejs-optimized factory implementation", function() {
					// The current working directory of npm test commands is the module root which is what process.cwd() returns.

					beforeEach(remove_cache)
					var example_module_dir = path.join(__dirname, "/..", "/example", "/nodejs/", "/factory")

					it_might("with and without the auto_anonymous option set will return the correct data" +
								  " when using only a callback as the definition parameter", function(done) {

						var umd = require("brace_umd")

						var module_text = `
							define("first", [], function() {
								
								return {
									id: "first"
								}

							})

							define("second", [], function() {
								
								return {
									id: "second"
								}

							})

							define(function(req) {

								return {
									id: "stand_alone",
									require: req
								}
							})
						`

						var module_path_a = path.join(example_module_dir, "/build", "/factory_a.js")
						var module_path_b = path.join(example_module_dir, "/build", "/factory_b.js")

						try {
							fs.writeFileSync(module_path_a, umd.wrap_start + module_text.toString() + 
								umd.wrap_end_option({force_type: "factory", auto_anonymous: false}))
							fs.writeFileSync(module_path_b, umd.wrap_start + module_text.toString() + 
								umd.wrap_end_option({force_type: "factory", auto_anonymous: true}))
						} catch(error) {
							expect(false, error).to.be.true
						}

						var module_one = require(module_path_a)
						var module_two = require(module_path_b)
						
						expect(module_one).to.not.have.key("first")
						expect(module_one).to.not.have.key("second")
						expect(module_one).to.have.any.key("id")
						expect(module_one.require).to.be.a("function")

						expect(module_two).to.not.have.key("first")
						expect(module_two).to.not.have.key("second")
						expect(module_two).to.have.any.key("id")
						expect(module_two).to.have.any.key("require")
						expect(module_two.require).to.be.a("function")

						done()

					})

					it_might("without the auto_anonymous option set will return the correct data", function(done) {

						var umd = require("brace_umd")
						var module_path = path.join(example_module_dir, "/build", "/factory.js")
						var module_text = `
						define("first", [], function() {
							
							return {
								id: "first"
							}

						})

						define("second", [], function() {
							
							return {
								id: "second"
							}

						})

						define(["first", "second"], function(first, second) {

							return {
								id: "stand_alone",
								first: first,
								second: second
							}
						})
						`
						try {
							fs.writeFileSync(module_path, umd.wrap_start + module_text + umd.wrap_end_option({force_type: "factory"}))
						} catch(error) {
							expect(false, error).to.be.true
						}

						var entry = require(module_path)

						expect(entry).to.nested.include({'first.id': "first"})
						expect(entry).to.nested.include({'second.id': "second"})
						expect(entry).to.include({'id': "stand_alone"})
						done()

					})

					it_might("will not load the module if it specifies an unavailable dependency", function(done) {

						var umd = require("brace_umd")
						var module_path = path.join(example_module_dir, "/build", "/factory.js")

						var module_text = `
							define("first", [], function() {
								
								return {
									id: "first"
								}

							})

							define("second", [], function() {
								
								return {
									id: "second"
								}

							})

							define(["first", "nope", "second"], function(first, nope, second) {

								return {
									id: "unmet",
									first: first,
									second: second
								}
							})
						`

						try {
							fs.writeFileSync(module_path, umd.wrap_start + module_text + umd.wrap_end_option({force_type: "factory"}))
						} catch(error) {
							expect(false, error).to.be.true
						}

						var entry = require(module_path)
						expect(entry).to.not.have.key("nope")
						expect(entry).to.not.have.key("id")
						expect(entry).to.nested.include({'first.id': "first"})
						expect(entry).to.nested.include({'second.id': "second"})
						done()

					})

					it_might("will load the require dependency as the require function", function(done) {

						var umd = require("brace_umd")
						var module_path = path.join(example_module_dir, "/build", "/factory.js")

						var module_text = `
							define("first", [], function() {
								
								return {
									id: "first"
								}

							})

							define("second", [], function() {
								
								return {
									id: "second"
								}

							})

							define(["require", "first", "second"], function(req, first, second) {
								return {
									id: "has_require",
									first: first,
									second: second,
									require: req 
								}
							})
						`
						try {
							fs.writeFileSync(module_path, umd.wrap_start + module_text + umd.wrap_end_option({force_type: "factory"}))
						} catch(error) {
							expect(false, error).to.be.true
						}

						var entry = require(module_path)
						expect(entry).to.have.any.key("id").that.include({"id": "has_require"})
						expect(entry).to.nested.include({'first.id': "first"})
						expect(entry).to.nested.include({'second.id': "second"})
						entry.id = "has_require_nest"
						expect(entry.require).to.be.a("function")

						var entry_nest = entry.require(module_path)
						expect(entry_nest).to.have.any.key("id").that.include({"id": "has_require_nest"})
						remove_cache("entry.js")
						entry_nest = entry.require(module_path)
						expect(entry_nest).to.have.any.key("id").that.include({"id": "has_require"})
						done()

					})

				})
			})
		})
	})
})
