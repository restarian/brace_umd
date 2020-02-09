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

	var build_path = path.join(__dirname, "..", "bin", "init_umd.js")

	beforeEach(cache.start.bind(cache))
	afterEach(cache.dump.bind(cache))

	describe("Checking for dependencies..", function() { 

		it("the build_umd program is available and at the right location", function(done) {
			it_will.stop = true 
			expect((function() { try { return require("brace_umd") }catch(e){ return e} })(), "brace_umd was not found on system").to.be.a("object")
			expect(fs.existsSync(build_path), "could not find the build_umd.js program").to.be.true
			it_will.stop = false 
			done()
		})
	})

	var project_dir_rel = path.join("example", "my_project", "package.json")
	var project_dir = path.join(__dirname, project_dir_rel)
	var project_dir_a = path.join(__dirname, "example", "my_project", "package_a.json")

	describe("The init_umd script functions when using the cli invoked via node process", function() {

		it("when the json file is not valid json data it returns error code 11", function(done) {

			// A new umd.js source build is created with the various config files in the test directory.
			utils.Spawn("node", [build_path, "-v", "-i", project_dir_a], undefined, function(exit_code, stdout, stderr) {
				expect(exit_code, "the build_init script exited with a code other than 11"+ stdout+stderr).to.equal(11)
				done()
			}, function(err) { expect(false, err).to.equal(true); done() })
		})
	
		it("when the json file is valid json data and the --create-template flag is not set with the --force flag set", function(done) {

			utils.Exec("node", [build_path, "-vs", "-i", project_dir, "--force"], undefined, function(exit_code, stdout, stderr) {
				expect(exit_code, "the build_init script exited with a code other than 0 "+ stdout+stderr).to.equal(0)
				var json = require(project_dir)
				expect(json).to.be.an("object")
				expect(json.scripts).to.be.an("object").that.includes({"build_amd": "r_js -o ./node_modules/brace_umd/template/rjs_build_first.js && r_js -o ./node_modules/brace_umd/template/rjs_build_second.js"})
				done()
			}, function(err) { expect(false, err).to.equal(true); done() })
		})

		it("when the json file is valid json data and the --create-template flag is not set with the --force flag set", function(done) {

			utils.Exec("node", [build_path, "-vs", "-i", project_dir, "--force"], undefined, function(exit_code, stdout, stderr) {
				expect(exit_code, "the build_init script exited with a code other than 0 "+ stdout+stderr).to.equal(0)
				var json = require(project_dir)
				expect(json).to.be.an("object")
				expect(json.scripts).to.be.an("object").that.includes({"build_amd": "r_js -o ./node_modules/brace_umd/template/rjs_build_first.js && r_js -o ./node_modules/brace_umd/template/rjs_build_second.js"})
				done()
			}, function(err) { expect(false, err).to.equal(true); done() })
		})

		it("when the json file is valid json with a relative path for the input-location and the --create-template flag is set but the --force flag is not that the script is not altered", function(done) {

			utils.Exec("node", [build_path, "-vst", "-i", path.join("example", "my_project", "package.json")], {cwd: __dirname}, function(exit_code, stdout, stderr) {
				expect(exit_code, "the build_init script exited with a code other than 0 "+ stdout+stderr).to.equal(0)
				var json = require(project_dir)
				expect(json).to.be.an("object")
				expect(json.scripts).to.be.an("object").that.includes({"build_amd": "r_js -o ./node_modules/brace_umd/template/rjs_build_first.js && r_js -o ./node_modules/brace_umd/template/rjs_build_second.js"})
				done()
			}, function(err) { expect(false, err).to.equal(true); done() })
		})

		it("when the json file is valid json data and the --create-template flag is set and the --force flag is set that the data is altered", function(done) {

			utils.Exec("node", [build_path, "-vstf", "-i", project_dir], undefined, function(exit_code, stdout, stderr) {
				expect(exit_code, "the build_init script exited with a code other than 0 "+ stdout+stderr).to.equal(0)
				var json = require(project_dir)
				expect(json).to.be.an("object")
				expect(json.scripts).to.be.an("object").that.includes({"build_amd": "r_js -o ./rjs_build_first.js && r_js -o ./rjs_build_second.js"})
				done()
			}, function(err) { expect(false, err).to.equal(true); done() })
		})
	})

	describe("The init_umd script functions when using the npm run script", function() {

		var params = ["run", "init_umd", "--"]

		it("when the json file is not valid json data it returns error code 11", function(done) {

			// A new umd.js source build is created with the various config files in the test directory.
			utils.Exec("npm", params.concat(["-v", "-i", project_dir_a]), undefined, function(exit_code, stdout, stderr) {
				expect(exit_code, "the build_init script exited with a code other than 11"+ stdout+stderr).to.equal(11)
				done()
			}, function(err) { expect(false, err).to.equal(true); done() })
		})
	
		it("when the json file is valid json data and the --create-template flag is not set with the --force flag set", function(done) {

			utils.Exec("npm", params.concat(["-vs", "-i", project_dir, "--force"]), undefined, function(exit_code, stdout, stderr) {
				expect(exit_code, "the build_init script exited with a code other than 0 "+ stdout+stderr).to.equal(0)
				var json = require(project_dir)
				expect(json).to.be.an("object")
				expect(json.scripts).to.be.an("object").that.includes({"build_amd": "r_js -o ./node_modules/brace_umd/template/rjs_build_first.js && r_js -o ./node_modules/brace_umd/template/rjs_build_second.js"})
				done()
			}, function(err) { expect(false, err).to.equal(true); done() })
		})

		it("when the json file is valid json data and the --create-template flag is not set with the --force flag set", function(done) {

			utils.Exec("npm", params.concat(["-vs", "-i", project_dir, "--force"]), undefined, function(exit_code, stdout, stderr) {
				expect(exit_code, "the build_init script exited with a code other than 0 "+ stdout+stderr).to.equal(0)
				var json = require(project_dir)
				expect(json).to.be.an("object")
				expect(json.scripts).to.be.an("object").that.includes({"build_amd": "r_js -o ./node_modules/brace_umd/template/rjs_build_first.js && r_js -o ./node_modules/brace_umd/template/rjs_build_second.js"})
				done()
			}, function(err) { expect(false, err).to.equal(true); done() })
		})

		it("when the json file is valid json data and the --create-template flag is set but the --force flag is not that the script is not altered", function(done) {

			utils.Exec("npm", params.concat([build_path, "-vst", "-i", project_dir]), undefined, function(exit_code, stdout, stderr) {
				expect(exit_code, "the build_init script exited with a code other than 0 "+ stdout+stderr).to.equal(0)
				var json = require(project_dir)
				expect(json).to.be.an("object")
				expect(json.scripts).to.be.an("object").that.includes({"build_amd": "r_js -o ./node_modules/brace_umd/template/rjs_build_first.js && r_js -o ./node_modules/brace_umd/template/rjs_build_second.js"})
				done()
			}, function(err) { expect(false, err).to.equal(true); done() })
		})

		it("when the json file is valid json with a relative path and the --create-template flag is set and the --force flag is set that the data is altered", function(done) {

			utils.Exec("npm", params.concat([build_path, "-vstf", "-i", path.join("test", project_dir_rel)]), undefined, function(exit_code, stdout, stderr) {
				expect(exit_code, "the build_init script exited with a code other than 0 "+ stdout+stderr).to.equal(0)
				var json = require(project_dir)
				expect(json).to.be.an("object")
				expect(json.scripts).to.be.an("object").that.includes({"build_amd": "r_js -o ./rjs_build_first.js && r_js -o ./rjs_build_second.js"})
				done()
			}, function(err) { expect(false, err).to.equal(true); done() })
		})
	})

})

