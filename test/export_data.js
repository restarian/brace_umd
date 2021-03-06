/* MIT License Copyright (c) 2020 Robert Steckroth <robertsteckroth@gmail.com>

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

  Brace Umd is a unified module definition script to use when defining javascript modules.

  this file is a part of Brace Umd

 Author: Robert Edward Steckroth, Bustout, <RobertSteckroth@gmail.com> */

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

	var build_path = path.join(__dirname, "..", "bin", "build_umd.js"),
		config_dir = path.join(__dirname, "config")

	beforeEach(cache.start.bind(cache))
	afterEach(cache.dump.bind(cache))

	describe("Checking for dependencies..", function() { 

		/*
		it("requirejs in available to the module system", function(done) {
			it_will.stop = true 
			expect((function() {try { rjs_path = require.resolve("requirejs"); return true } catch(e) { return e }})(), "could not load the requirejs dependency").to.be.true
			it_will.stop = false 
			done()
		})
		*/

		it("the build_umd program is available and at the right location", function(done) {
			it_will.stop = true 
			expect((function() { try { return require("brace_umd") }catch(e){ return e} })(), "brace_umd was not found on system").to.be.a("object")
			expect(fs.existsSync(build_path), "could not find the build_umd.js program").to.be.true
			expect(build_path, "the expected path of the build_umd program is not the one located by the unit test")
						.to.equal(require("brace_umd").build_program_path)
			it_will.stop = false 
			done()
		})
	})

	describe("the module export data", function() {

		// An array with the values of the test directory is filtered to include all of the files included with the regex.
		var config_file = fs.readdirSync(config_dir).filter(function(value) { return /^build_config_.*\.json/.test(value) })
		config_file.forEach(function(value) {

			value = path.join(__dirname, "config", value)
			
			it("using the build_umd.js script builds using the config file "+ value, function(done) {

				// A new umd.js source build is created with the various config files in the test directory.
				utils.Spawn("node", [build_path, "--config-file", value], undefined, function(exit_code, stdout, stderr) {
					expect(exit_code, "the build_umd script exited with a code other than 0 "+ stdout+stderr).to.equal(0)
					done()
				}, function(err) { expect(false, err).to.equal(true); done() })

			})

			it("the export member wrap_end_option returns the correct string with the option data added to it", function(done) {

				var data = require("../")
				expect(data.wrap_end_option()).to.equal(data.wrap_end)
				expect(data.wrap_end_option({})).to.equal(data.wrap_end)
				expect(data.wrap_end_option({cool: "joes"})).to.be.not.equal(data.wrap_end)
				expect(data.wrap_end_option({cool: "joes"})).to.include('{"cool":"joes"}')
				expect(data.wrap_end_option({abool: true})).to.include('{"abool":true}')
				expect(data.wrap_end_option({abool: false})).to.include('{"abool":false}')
				expect(data.wrap_end_option({cool: "joes", num: 0,num:44})).to.include('{"cool":"joes","num":44}')
				done()
			})

			it("the export member version is the same as the current one", function(done) {

				var data = require("../")
				var info = require("../package.json")
				expect(data.build_information).to.be.an("object")
				expect(data.build_information.version).to.equal(info.version)
				done()
			})
		})
	})

})

