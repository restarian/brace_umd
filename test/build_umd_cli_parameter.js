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

var expect = require("chai").expect,
	path = require("path"),
	fs = require("fs"),
	test_help = require("test_help"),
	intercept = require("intercept-stdout"),
	maybe = require("mocha-maybe")

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
	config_dir = path.join(__dirname, "/config"),
	rjs_path

describe("Using stop further progression methodology for file dependencies: "+path.basename(__filename), function() { 

	// The stop property of the first describe enclosure is used to control test skipping.
	beforeEach(remove_cache)
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
			this.stop = false 
			done()
		})
		*/

	})

	describe("The build script", function() {

		beforeEach(remove_cache)

		it_might("should export the correct build file with only the preamble option set to false", function(done) {

			// This will use the run-time accessed tested_option but it does matter what is set to it.

			new Spinner("", [build_path, "--tested-options", path.join(config_dir, "/unit_tested_option_a.json"), "--beautify", 
									"preamble=false"], undefined, function(exit_code) {
				expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)
				
				var export_option = require("brace_umd").build_option
				expect(export_option).to.be.an("object")
				expect(export_option).to.deep.equal({output: {"beautify": true}, compress: false, mangle: false})
				done()
			})
		})

		it_might("should provide a warning message when non-tested options which are attempted to be set", function(done) {

			new Spinner("", [build_path, "--tested-options", path.join(config_dir, "/unit_tested_option_a.json"), "--compress", 
									"unused,unsafe"], undefined, function(exit_code) {
				expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)

				var tested_file = require("brace_umd").build_information.tested_options_file
				expect(this.stdout).to.include("Option compress.unsafe is not defined in the tested options file: " + tested_file + 
								" -- Therefore it is not safe to use and will be skipped.")
				done()
			})
		})

		it_might("create the correct mangle build option output with the unit test file a", function(done) {

			new Spinner("", [build_path, "--tested-options", path.join(config_dir, "/unit_tested_option_a.json"), "--mangle", 
									"reserved=[cool],reservedd=[nope]", "--mangle-props", "reserved=[require],notme=true", "--beautify", 
									"beautify=false,saywhat=false,semicolons=false"], undefined, function(exit_code) {
				expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)


				var tested_file = require("brace_umd").build_information.tested_options_file
				var export_option = require("brace_umd").build_option

				expect(this.stdout).to.include("Option mangle.reservedd is not defined in the tested options file: " + tested_file + 
							" -- Therefore it is not safe to use and will be skipped.")
				expect(export_option).to.include({compress: false})
				expect(export_option.mangle).to.deep.equal({reserved: ["cool"], properties: {reserved: ["require", "exports"]}})
				done()
			})
		})

		it_might("create the correct mangle and compress output with the unit test file b", function(done) {

			new Spinner("", [build_path, "--tested-options", path.join(config_dir, "/unit_tested_option_b.json"), "--mangle", 
					"reservedd=true,properties=false", "--compress", "--beautify", 
					"beautify=false,saywhat=false,semicolons=false"], undefined, function(exit_code) {
				expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)

				var tested_file = require("brace_umd").build_information.tested_options_file
				// This does not change so the require cache will not need to be deleted in the afterEach above.
				var export_option = require("brace_umd").build_option

				expect(this.stdout).to.include("Option mangle.reservedd is not defined in the tested options file: " + tested_file + 
				" -- Therefore it is not safe to use and will be skipped.")

				expect(export_option).to.be.an("object")
				// The unused option needs to be set when uglify is used
				expect(export_option.compress).to.equal(true)
				expect(export_option.mangle).to.deep.equal({})
				done()
			})
		})

		it_might("should warn and exit when the tested-options file does not exist", function(done) {

			new Spinner("", [build_path, "--tested-options", path.join(config_dir, "/unit_tested_option_nope.json"), "--compress", 
					"unused=false,unsafe,nah,sequences", "--beautify", "saywhat=false"], undefined, function(exit_code) {

				// 7 is the exit code for early returns in the build_script
				expect(parseInt(exit_code)).to.equal(7)
				expect(this.stdout).to.include("ENOENT: no such file or directory, open")
				done()
			})
		})

		it_might("a config file with non-uglify options errors and exits with code 11", function(done) {

			new Spinner("", [build_path, "--config-file", path.join(config_dir, "/build_config_b.json"), "--tested-options", 
					path.join(config_dir, "/unit_tested_option_a.json")], undefined, function(exit_code) {

				// return code 11 is an uglify-js error
				expect(parseInt(exit_code)).to.equal(11)
				expect(this.stdout).to.include("DefaultsError: `test` is not a supported option")
				expect(this.stdout).to.include("Option mangle.test.cools is not defined in the tested options file: " + path.join(config_dir, 
				"/unit_tested_option_a.json") + " -- Therefore it is not safe to use and will be skipped.")
				done()	
			})
		})

		it_might("a config file with nested Object mangle options works as expected", function(done) {

			new Spinner("", [build_path, "--config-file", path.join(config_dir, "/build_config_d.json"), "--tested-options", 
					path.join(config_dir, "/unit_tested_option_a.json")], undefined, function(exit_code) {

				var export_option = require("brace_umd").build_option
				expect(export_option).to.be.an("object")
				expect(export_option.output).to.have.any.keys("preamble")
				expect(export_option.mangle).to.be.an("object")
				expect(export_option.mangle.reserved).to.be.an("array").that.deep.equal(["joes", true, "false"])
				expect(export_option.mangle.properties).to.be.an("object")
				expect(export_option.mangle.properties.reserved).to.be.an("array").that.deep.equal(["cool", false, false, "exports"])
				done()
			})
		})

		it_might("config file with all options set to false will export correctly", function(done) {

			new Spinner("", [build_path, "--config-file", path.join(config_dir, "/build_config_c.json")], undefined, function(exit_code) {
				expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)

				var export_option = require("brace_umd").build_option
				expect(export_option).to.be.an("object")

				// Both compress and mangle are set to false as defaults. Uglify-js will set the compress and mangle to true as defaults when used
				// from the command line but not when used at run-time which is corrected in brace_umd.
				expect(export_option.compress).to.equal(false)
				expect(export_option.mangle).to.equal(false)
				expect(export_option.output).to.have.keys("preamble")

				done()
			})
		})

		it_might("should not make the changes of non-tested build options which are attempted to be set", function(done) {

			new Spinner("", [build_path, "--tested-options", path.join(config_dir, "/unit_tested_option_a.json"), "--compress", 
					"unused=false,unsafe,nah,sequences", "--beautify", "saywhat=false"], undefined, function(exit_code) {
				expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)

				var export_option = require("brace_umd").build_option
				expect(this.stdout).to.include("Option compress.unused is not defined in the tested options file: " + 
				path.join(config_dir, "/unit_tested_option_a.json") + " -- Therefore it is not safe to use and will be skipped.")
				expect(export_option).to.be.an("object")
				expect(export_option.output).to.have.any.keys("preamble")
				expect(export_option.compress).to.include({sequences: true}).that.not.have.any.keys("nah")

				done()
			})
		})

		it_might("odd cli arguments are processed appropriately", function(done) {

			new Spinner("", [build_path, "--tested-options", path.join(config_dir, "/unit_tested_option_a.json"), "--mangle", "_", 
					"--compress", "properties=false,sequences=false,nah,_un=ff,_,_=aa", "--beautify", "saywhat=false"], undefined, function(exit_code) {
				expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)

				var tested_file = require("brace_umd").build_information.tested_options_file
				var export_option = require("brace_umd").build_option
				expect(this.stdout).to.include("Option compress.nah is not defined in the tested options file: " + tested_file + 
						" -- Therefore it is not safe to use and will be skipped.")
				expect(this.stdout).to.include("Option compress._un is not defined in the tested options file: " + tested_file + 
						" -- Therefore it is not safe to use and will be skipped.")
				expect(this.stdout).to.include("Option mangle._ is not defined in the tested options file: " + tested_file + 
						" -- Therefore it is not safe to use and will be skipped.")
				expect(this.stdout).to.include("Option compress._ is not defined in the tested options file: " + tested_file + 
						" -- Therefore it is not safe to use and will be skipped.")
				expect(this.stdout).to.include("Option output.saywhat is not defined in the tested options file: " + tested_file + 
						" -- Therefore it is not safe to use and will be skipped.")

				expect(export_option).to.be.an("object")
				expect(export_option.compress).to.not.have.any.keys("properties")
				expect(export_option.compress).to.include({sequences: false})

				done()

			})
		})

		it_might("the mangle option is omitted if mangle not specified at all", function(done) {

			// build_config_a.json in an empty Object
			new Spinner("", [build_path, "--config-file", path.join(config_dir, "/build_config_a.json")], undefined, function(exit_code) {
				expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)

				var export_option = require("brace_umd").build_option
				expect(export_option).to.be.an("object")
				expect(export_option.mangle).to.not.be.an("object")
				done()
			})
		})

		it_might("the mangle reserved options creates values as Array data if the value is non-array via the command line", function(done) {

			// build_config_a.json in an empty Object
			new Spinner("", [build_path, "--config-file", path.join(config_dir, "/build_config_a.json"), "--mangle", "reserved=false", 
					"--mangle-props", "reserved=true"], undefined, function(exit_code) {
				expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)

				var export_option = require("brace_umd").build_option

				expect(export_option).to.be.an("object")
				expect(export_option.mangle).to.be.an("object")
				expect(export_option.mangle.reserved).to.equal(false)
				expect(export_option.mangle.properties).to.be.an("object")
				expect(export_option.mangle.properties.reserved).to.be.an("array")
				expect(export_option.mangle.properties.reserved).to.deep.equal(["exports"])

				done()
			})
		})

		it_might("the mangle reserved options creates values as Array data if Array syntax is set via the command line", function(done) {

			new Spinner("", [build_path, "--config-file", path.join(config_dir, "/build_config_a.json"), "--mangle", "reserved=[false,'cool']", 
					"--mangle-props", "reserved=[joes,true]"], undefined, function(exit_code) {
				expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)

				var export_option = require("brace_umd").build_option

				expect(export_option).to.be.an("object")
				expect(export_option.mangle).to.be.an("object")
				expect(export_option.mangle.reserved).to.be.an("array")
				expect(export_option.mangle.reserved).to.deep.equal([false, "cool"])
				expect(export_option.mangle.properties).to.be.an("object")
				expect(export_option.mangle.properties.reserved).to.be.an("array")
				expect(export_option.mangle.properties.reserved).to.deep.equal(["joes", true, "exports"])

				done()
			})
		})

		it_might("the mangle reserved options create values as Array data if Array syntax is set via the config file (test/config/build_config_d.json", function(done) { 
			new Spinner("", [build_path, "--config-file", path.join(config_dir, "/build_config_d.json")], undefined, function(exit_code) {
				expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)

				var export_option = require("brace_umd").build_option

				expect(export_option).to.be.an("object")
				expect(export_option.mangle).to.be.an("object")
				expect(export_option.mangle.reserved).to.be.an("array").that.deep.equal(["joes", true, "false"])
				expect(export_option.mangle.properties).to.be.an("object")
				expect(export_option.mangle.properties.reserved).to.be.an("array")
				expect(export_option.mangle.properties.reserved).to.deep.equal(["cool", false, false, "exports"])

				done()
			})
		})

		it_might("an empty config-file is accepted and used appropriately", function(done) {

			// build_config_a.json in an empty Object
			new Spinner("", [build_path, "--config-file", path.join(config_dir, "/build_config_a.json")], undefined, function(exit_code) {
				expect(exit_code, "the build_umd script exited with a code other than 0").to.equal(0)

				var info = require("brace_umd").build_information
				var export_option = require("brace_umd").build_option

				expect(export_option).to.be.an("object")
				expect(export_option.output).to.be.an("object")
				expect(export_option.output.preamble).to.equal("/* Generated by Brace_UMD "+ info.version + " */" )

				done()
			})
		})
	})
})
