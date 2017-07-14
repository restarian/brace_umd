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

describe("Module loading", function() {

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

  })

  describe("", function() {

  	it("", function(done) {

      //build_process("")
      //build_script.on("close", function(exit_code) {
        //done()
      //})
      done()
  	})
	})

})
