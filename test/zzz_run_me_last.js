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

var expect = require("chai").expect
	path = require("path"),
	test_help = require("test_help"),
	maybe = require("mocha-maybe")

var Spinner = test_help.Spinner
	//remove_cache = test_help.remove_cache.bind(null, "brace_umd.js")

// Adding node to the command string will help windows know to use node with the file name. The unix shell knows what the #! at the beginning
// of the file is for. The build_umd.js source will run if the spinner command is empty by setting the default_command member.
Spinner.prototype.default_command = "node" 
Spinner.prototype.log_stdout = true 
Spinner.prototype.log_stderr = true 
Spinner.prototype.log_err = true 

var build_path = path.join(__dirname, "/../", "/bin", "/build_umd.js")

describe("This test is ran to build the project source back to the default because the unit tests", function() {

	it("this test is to build the project as the doc pages were", function(done) {

      new Spinner("", [build_path, "--config-file", path.join(__dirname, "/../", "/doc", "/doc_config.json")], undefined, function(exit_code) {
         expect(parseInt(exit_code)).to.equal(5)
         done()

		})
	})
})
