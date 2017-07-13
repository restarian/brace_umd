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

//var describe = require('mocha');

var expect = require("chai").expect
var spawn = require('child_process').spawn
var path = require('path')

describe("The build script", function() {

	//beforeEach(function() { })
	it.only("should export the correct build file data when ran as a shell script.", function(done) {

    build_script = spawn(path.join(__dirname, "/../bin/build_umd.js"))//, ['-lh', '/usr'])
    //build_script = spawn("ls", ['-lh'])

    build_script.stdout.on('data', (data) => {
      console.log("stdout: ${data}")
    })

    build_script.stderr.on('data', (data) => {
      console.log("stderr: ${data}")
    })

    build_script.on('close', (code) => {
      console.log("child process exited with code ${code}")
      done()
    })

	})
})
