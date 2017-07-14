/*
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
var spawn = require("child_process").exec
var path = require("path")
var fs = require("fs")

describe("The build script", function() {

  var build_script = null
  var stdout = stderr = ""
  var build_process = function(parameter) {

    // Adding node to the command string will help windows know to use node with the file name. The unix shell knows what the #! at the beggining of the file is for.
    build_script = spawn("node "+path.join(__dirname, "/../bin/build_umd.js ")+parameter)

    build_script.stdout.on("data", (data) => {
      stdout += data.toString()
    })

    build_script.stderr.on("data", (data) => {
      stderr += data.toString()
    })

  }

  afterEach(function(){

    build_script = null
    stdout = stderr = code = ""
    // The module need to be reloaded again so that it is idempotent after changes are made to it.
    for ( var id in require.cache )
      if ( path.parse(id).base === "exporter.js")
        delete require.cache[id]
      else if ( path.parse(id).base === "tested_option.json")
        delete require.cache[id]

  })

  describe("as a shell process", function() {

  	it("should export the correct build file when no cli arguments are utilized.", function(done) {

      build_process("")

      build_script.on("close", function(exit_code) {

        //code = parseInt(exit_code)
        var tested_option = require(path.join(__dirname, "/../lib/tested_option.json"))
        var export_option = require("../").build_option
        // Delete the three build options which are set internally.
        delete export_option.compress.unused
        delete export_option.mangle.reserved
        delete export_option.mangle.reserved
        // preamble is tough to match so it is ignored
        delete export_option.output.preamble
        delete tested_option.output.preamble
        // These should both be the same now.
        expect(tested_option).to.deep.equal(export_option)
        done()
      })
  	})

  	it("should provide a warning message when internally set options are attempted to be set", function(done) {

      build_process("--compress unused,unsafe,nope mangle reserved=[]")
      build_script.on("close", (exit_code) => {
        expect(stdout).to.include("Option compress.unused is set internally and therefore will not be re-set.")
        expect(stdout).to.include("Option mangle.reserved is set internally and therefore will not be re-set.")
        expect(stdout).to.include("Option compress.unsafe is not defined in the tested_option.json file therefore is not safe to use and will be skipped.")
        expect(stdout).to.include("Option compress.nope is not defined in the tested_option.json file therefore is not safe to use and will be skipped.")
        done()
      })
    })

  	it("should provide a warning message when non-tested options which are attempted to be set", function(done) {

      build_process("--compress unused,unsafe")
      build_script.on("close", (exit_code) => {
        expect(stdout).to.include("Option compress.unused is set internally and therefore will not be re-set.")
        expect(stdout).to.include("Option compress.unsafe is not defined in the tested_option.json file therefore is not safe to use and will be skipped.")
        done()
      })
    })
  	it("should not make the changes of internally and non-tested build options which attempted to be set", function(done) {

      build_process("--compress unused,unsafe,nah --mangle reserved=true --beautify beautify=false,saywhat=false,semicolons=false")
      build_script.on("close", function(exit_code) {

        var tested_option = require(path.join(__dirname, "/../lib/tested_option.json"))
        var export_option = require("../").build_option
        // Delete the three build options which are set internally.
        delete export_option.compress.unused
        delete export_option.mangle.reserved
        // preamble is tough to match so it is ignored
        delete export_option.output.preamble
        delete tested_option.output.preamble
        // These should both be the same now.

        tested_option.output.beautify = false
        tested_option.output.semicolons = false

        expect(tested_option).to.deep.equal(export_option)
        done()
      })
  	})
  	it("should not make the changes of non-tested build options which are attempted to be set", function(done) {

      build_process("--compress unused,unsafe,nah --beautify saywhat=false")
      build_script.on("close", (exit_code) => {
        code = parseInt(exit_code)

        var tested_option = require(path.join(__dirname, "/../lib/tested_option.json"))
        var export_option = require("../").build_option
        // Delete the three build options which are set internally.
        delete export_option.compress.unused
        delete export_option.mangle.reserved
        // preamble is tough to match so it is ignored
        delete export_option.output.preamble
        delete tested_option.output.preamble
        // These should both be the same now.
        expect(tested_option).to.deep.equal(export_option)
        done()
      })
  	})
  	//it("should configure the preamble build option differently", function(done) {
	  //})
	})

})
