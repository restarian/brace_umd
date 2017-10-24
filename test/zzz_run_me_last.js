
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

var build_path = path.join(__dirname, "/../", "/bin", "/build_umd.js")

describe("This test is ran to build the project source back to the default because the unit tests", function() {

  	it("this test is to build the project as the doc pages were", function(done) {

      new Spinner("", [build_path, "--config-file", path.join(__dirname, "/../", "/doc", "/doc_config.json")], undefined, function(exit_code) {
         expect(parseInt(exit_code)).to.equal(5)
         done()

      })
    })
 })
