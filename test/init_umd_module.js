/* Copyright (c) 2018 Robert Steckroth <RobertSteckroth@gmail.com>

Brace UMD resides under the MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

Brace Umd is a module building platform with an integrated unified module definition wrapper.

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

var expect = require("chai").expect,
	path = require("path"),
	fs = require("fs"),
	utils = require("bracket_utils"),
	maybe = require("brace_maybe")

module.paths.unshift(path.join(__dirname, "..", ".."))
var cache = utils.cacheManager(require)
var it_will = global

describe("Using stop further progression methodology for dependencies in: "+path.basename(__filename), function() { 

	// The stop property of the first describe enclosure is used to control test skipping.
	var it = maybe(it_will)	
	it_will.stop = !!process.env.DRY_RUN  
	it_will.quiet = !!process.env.QUIET

	var lib_path = path.join(__dirname, "..", "lib", "init.js")

	describe("Checking for dependencies..", function() { 

		it("the build_umd program is available and at the right location", function(done) {
			it_will.stop = true 
			expect((function() { try { return require("brace_umd") }catch(e){ return e} })(), "brace_umd was not found on system").to.be.a("object")
			expect(fs.existsSync(lib_path), "could not find the build_umd.js program").to.be.true
			it_will.stop = false 
			done()
		})

		it("r_js in the system as a program", function(done) {

			it_will.stop = true 
			expect((function() {try { require("requirejs"); return true; } catch(e) { return e; }})()).to.be.true 
			it_will.stop = false 
			done()
		})

	})

	describe("The init.js api functions when using the library module with an amd loader", function() {

		var project_dir_rel = path.join("example", "my_project", "package.json")
		var project_dir = path.join(__dirname, project_dir_rel)
		var project_dir_a = path.join(__dirname, "example", "my_project", "package_a.json")
		
		var requirejs
		beforeEach(function() {

			cache.start()
			requirejs = require("requirejs")
			requirejs.config({baseUrl: path.join(__dirname, "..", "lib"), nodeRequire: require})
		})
		afterEach(cache.dump.bind(cache))

		it("when the json file is not valid json data it returns error code 11", function(done) {

			requirejs(["init"], function(init) {

				var option = {verbose: true, inputLocation: project_dir_a}
				expect(init).to.be.a("function")
				expect(init(option)).to.have.any.keys("run")

				init(option).run(function() {
					expect(false, "The module should have errored.").to.be.true
					done()
				}, function(exit_code, err) { 
					expect(exit_code, "the build_init script exited with a code other than 11"+err.toString()).to.equal(11)
					done()
				})
			})
		})
	
		it("when the json file is valid json data and the --create-template flag is not set with the --force flag set", function(done) {

			requirejs(["init"], function(init) {

				var option = {createScript: true, force: true, verbose: true, inputLocation: project_dir}
				expect(init).to.be.a("function")
				expect(init(option)).to.have.any.keys(["run", "retrieveJson"])
				init(option).run(function() {

					init(option).retrieveJson(project_dir, function(json) {

						expect(json).to.be.an("object").that.has.any.keys("scripts")
						expect(json.scripts).to.have.any.keys("build_amd").that.includes({"build_amd": "r_js -o ./node_modules/brace_umd/template/rjs_build_first.js && r_js -o ./node_modules/brace_umd/template/rjs_build_second.js"})
						done()
					}, function(err) { expect(false, err.toString()).to.equal(true); done() })
				}, function(err) { expect(false, err.toString()).to.equal(true); done() })
			})
		})

		it("when the json file is valid json data and the --create-template flag is set but the --force flag is not that the script is not altered", function(done) {

			requirejs(["init"], function(init) {

				var option = {createScript: true, createTemplate: true, force: false, verbose: true, inputLocation: project_dir}
				expect(init).to.be.a("function")
				expect(init(option)).to.have.any.keys(["run", "retrieveJson"])
				init(option).run(function() {

					init(option).retrieveJson(project_dir, function(json) {

						expect(json).to.be.an("object").that.has.any.keys("scripts")
						expect(json.scripts).to.have.any.keys("build_amd").that.includes({"build_amd": "r_js -o ./node_modules/brace_umd/template/rjs_build_first.js && r_js -o ./node_modules/brace_umd/template/rjs_build_second.js"})
						done()
					}, function(err) { expect(false, err.toString()).to.equal(true); done() })
				}, function(err) { expect(false, err.toString()).to.equal(true); done() })
			})
		})

		it("when the json file is valid json data and the --create-template flag is set and the --force flag is set that the data is altered", function(done) {

			requirejs(["init"], function(init) {

				var option = {createScript: true, createTemplate: true, force: true, verbose: true, inputLocation: project_dir}
				expect(init).to.be.a("function")
				expect(init(option)).to.have.any.keys(["run", "retrieveJson"])
				init(option).run(function() {

					init(option).retrieveJson(project_dir, function(json) {

						expect(json).to.be.an("object").that.has.any.keys("scripts")
						expect(json.scripts).to.be.an("object").that.includes({"build_amd": "r_js -o ./rjs_build_first.js && r_js -o ./rjs_build_second.js"})
						done()
					}, function(err) { expect(false, err.toString()).to.equal(true); done() })
				}, function(err) { expect(false, err.toString()).to.equal(true); done() })
			})
		})
	})

})

