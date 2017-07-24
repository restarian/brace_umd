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
var requirejs = require("requirejs")
var fs = require("fs")
require("amd-loader")

describe("Amdefine module loading after using r_js optimization", function() {

    // Adding node to the command string will help windows know to use node with the file name. The unix shell knows what the #! at the beggining of the file is for.
  var spinner = function() {

    this.cb = typeof arguments[3] === "function" && arguments[3] || function(){}
    this.err = typeof arguments[4] === "function" && arguments[4] || function(){}
    this.parameters = arguments[1]||[]
    this.stdout = this.stderr = ""
    var command = (arguments[0] || "node "+path.join(__dirname, "/../bin/build_umd.js ")) + " " + this.parameters.join(" ")
    this._spinner = spawn(command, [], arguments[2])

    this._spinner.stdout.on("data", this.standard_out.bind(this))
    this._spinner.stderr.on("data", this.standard_err.bind(this))
    this._spinner.on("exit", this.exit.bind(this))
    this._spinner.on("error", this.error.bind(this))

  }

  spinner.prototype = {

    error: function(error) {
      this.err.call(this, error)
    },
    standard_out: function(chunk) {
      this.stdout += chunk
    },
    standard_err: function(chunk) {
      this.stderr += chunk
    },
    exit: function(code) {
      this.cb.call(this, code)
    }
  }

  describe("Using config file ", function() {
  	it("the example module at will build using the rjs_config.js file and the correct module value will load", function(done) {
      var a = require("./stuffss")
      console.log(a)
      require("entry")
      done()
    })
	})

})
