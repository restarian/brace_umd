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

  	it("should export the correct build file with only the preamble option set to false", function(done) {

      // This will use the run-time accessed tested_option but it does matter what is set to it.
      build_process("--tested-options test/unit_tested_option_a.json --beautify preamble=false")

      build_script.on("exit", function(exit_code) {
        expect(parseInt(exit_code)).to.equal(5)
        var export_option = require("../").build_option
        expect(export_option).to.be.an("object")
        expect(export_option).to.deep.equal({output: {"beautify": true}})
        done()
      })
  	})

  	it("should provide a warning message when non-tested options which are attempted to be set", function(done) {

      build_process("--tested-options test/unit_tested_option_a.json --compress unused,unsafe")
      build_script.on("exit", function(exit_code) {
        expect(parseInt(exit_code)).to.equal(5)
        var tested_file = require("../").build_information.tested_options_file
        expect(stdout).to.include("Option compress.unsafe is not defined in the tested options file: " + tested_file + " -- Therefore it is not safe to use and will be skipped.")
        done()
      })
    })

  	it("create the correct mangle build option output with the unit test file a", function(done) {

      build_process("--tested-options test/unit_tested_option_a.json --mangle reservedd=true,properties --beautify beautify=false,saywhat=false,semicolons=false")
      build_script.on("exit", function(exit_code) {

        expect(parseInt(exit_code)).to.equal(5)

        var tested_file = require("../").build_information.tested_options_file
        var export_option = require("../").build_option

        expect(stdout).to.include("Option mangle.reservedd is not defined in the tested options file: " + tested_file + " -- Therefore it is not safe to use and will be skipped.")
        expect(export_option).to.be.an("object")
        expect(export_option.compress).to.be.a("undefined")
        expect(export_option.mangle).to.deep.equal({reserved: ["define", "require", "requirejs"], properties: true})
        done()
      })

    })

  	it("create the correct mangle and compress output with the unit test file b", function(done) {

      build_process("--tested-options test/unit_tested_option_b.json --mangle reservedd=true,properties --compress --beautify beautify=false,saywhat=false,semicolons=false")
      build_script.on("exit", function(exit_code) {

        expect(parseInt(exit_code)).to.equal(5)

        var tested_file = require("../").build_information.tested_options_file
        var tested_option = require(tested_file)
        var export_option = require("../").build_option

        expect(stdout).to.include("Option mangle.reservedd is not defined in the tested options file: " + tested_file + " -- Therefore it is not safe to use and will be skipped.")

        expect(export_option).to.be.an("object")
        expect(export_option.compress).to.equal(true)
        expect(export_option.mangle).to.deep.equal({ reserved: [ 'define', 'require', 'requirejs' ] })
        done()
      })
    })

  	it("should warn and exit when the tested-options file does not exist", function(done) {
      build_process("--tested-options test/unit_tested_option_nope.json --compress unused=false,unsafe,nah,sequences --beautify saywhat=false")
      build_script.on("exit", function(exit_code) {
         // 9 is the exit code for early returns in the build_script
         expect(parseInt(exit_code)).to.equal(7)
         expect(stdout).to.include("ENOENT: no such file or directory, open")
         done()
      })
    })

  	it("config file with all options set to false will export correctly", function(done) {

      build_process("--config-file test/build_config_b.json")
      build_script.on("exit", function(exit_code) {
        expect(parseInt(exit_code)).to.equal(5)
        var export_option = require("../").build_option
        expect(export_option).to.be.an("object")

        expect(export_option.compress).to.equal(false)
        expect(export_option.mangle).to.equal(false)
        expect(export_option.output).to.have.keys("preamble")

        done()
      })
    })

  	it("should not make the changes of non-tested build options which are attempted to be set", function(done) {

      build_process("--tested-options test/unit_tested_option_d.json --compress unused=false,unsafe,nah,sequences --beautify saywhat=false")
      build_script.on("exit", function(exit_code) {
        expect(parseInt(exit_code)).to.equal(5)

        var export_option = require("../").build_option
        expect(export_option).to.be.an("object")
        expect(export_option.compress).to.deep.equal({unused: false, unsafe: true, sequences: true})
        expect(export_option.output).to.have.any.keys("preamble")
        expect(export_option.compress).to.not.have.any.keys("nah")
        done()
      })
    })


  	it("odd cli arguments are processed appropriately", function(done) {

      build_process("--tested-options test/unit_tested_option_d.json --mangle _ --compress=false --compress properties=false,unsafe,nah,_un=ff,_,_=aa --beautify saywhat=false")
      build_script.on("exit", function(exit_code) {
        expect(parseInt(exit_code)).to.equal(5)

        var tested_file = require("../").build_information.tested_options_file
        var export_option = require("../").build_option
        expect(stdout).to.include("Option compress.nah is not defined in the tested options file: " + tested_file + " -- Therefore it is not safe to use and will be skipped.")
        expect(stdout).to.include("Option compress._un is not defined in the tested options file: " + tested_file + " -- Therefore it is not safe to use and will be skipped.")
        expect(stdout).to.include("Option compress._ is not defined in the tested options file: " + tested_file + " -- Therefore it is not safe to use and will be skipped.")
        expect(stdout).to.include("Option output.saywhat is not defined in the tested options file: " + tested_file + " -- Therefore it is not safe to use and will be skipped.")

        expect(export_option).to.be.an("object")
        expect(export_option.compress).to.be.an("object")
        expect(export_option.compress.properties).to.equal(false)
        expect(export_option.compress.unsafe).to.equal(true)

        done()
      })
  	})

  	it("the mangle option is omitted if mangle not specified at all", function(done) {

      // build_config_a.json in an empty Object
      build_process("--config-file test/build_config_a.json")
      build_script.on("exit", function(exit_code) {
        expect(parseInt(exit_code)).to.equal(5)
        var export_option = require("../").build_option
        expect(export_option).to.be.an("object")
        expect(export_option.mangle).to.not.be.an("object")
        done()
      })
  	})

  	it("the reserved option appends internally used namspaces when only specified to mangle", function(done) {

      // build_config_a.json in an empty Object
      build_process("--config-file test/build_config_a.json --mangle")
      build_script.on("exit", function(exit_code) {
        expect(parseInt(exit_code)).to.equal(5)
        var export_option = require("../").build_option
        expect(export_option).to.be.an("object")
        expect(export_option.mangle).to.be.an("object")
        expect(export_option.mangle.reserved).to.deep.equal([ "define", "require", "requirejs" ])
        done()
      })
  	})

  	it("the reserved option appends internally used namspaces when it is set to false", function(done) {

      // build_config_a.json in an empty Object
      build_process("--config-file test/build_config_a.json --mangle reserved=false")
      build_script.on("exit", function(exit_code) {
        expect(parseInt(exit_code)).to.equal(5)
        var export_option = require("../").build_option
        expect(export_option).to.be.an("object")
        expect(export_option.mangle).to.be.an("object")
        expect(export_option.mangle.reserved).to.deep.equal([ "define", "require", "requirejs" ])
        done()
      })
  	})


  	it("the reserved option appends internally used namspaces to a Array parameter", function(done) {

      // build_config_a.json in an empty Object
      build_process("--config-file test/build_config_a.json --mangle reserved=[cool,joes,false]")
      build_script.on("exit", function(exit_code) {
        expect(parseInt(exit_code)).to.equal(5)
        var export_option = require("../").build_option
        expect(export_option).to.be.an("object")
        expect(export_option.mangle).to.be.an("object")
        expect(export_option.mangle.reserved).to.deep.equal([ "cool", "joes", false, "define", "require", "requirejs" ])
        done()
      })
  	})

  	it("an empty config-file is accepted and used appropriately", function(done) {

      // build_config_a.json in an empty Object
      build_process("--config-file test/build_config_a.json")
      build_script.on("exit", function(exit_code) {
        expect(parseInt(exit_code)).to.equal(5)
        var tested_file = require("../").build_information.tested_options_file
        var export_option = require("../").build_option

        expect(export_option).to.be.an("object")
        expect(export_option.output).to.be.an("object")
        expect(export_option.output.preamble).to.equal("/* Generated by Brace_UMD 0.2.9 */")

        done()
      })
  	})

  	it("this test is to build the project as the doc pages were", function(done) {

      build_process("--config-file doc/doc_config.json")
      build_script.on("exit", function(exit_code) {
        expect(parseInt(exit_code)).to.equal(5)
        done()

      })
    })

  })
})
