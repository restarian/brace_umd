
var expect = require("chai").expect
	path = require("path"),
	method = require("process-wrap")
	//maybe = require("mocha-maybe")

var Spinner = method.Spinner
// Adding node to the command string will help windows know to use node with the file name. The unix shell knows what the #! at the beginning
// of the file is for. The build_umd.js source will run if the spinner command is empty by setting the default_command member.
Spinner.prototype.default_command = "node" 
var build_path = path.join(__dirname, "/../", "/bin", "/build_umd.js") 

describe("This test is ran to build the project source back to the default because the unit tests ", function() {

  	it("this test is to build the project as the doc pages were", function(done) {

      new Spinner("node", [build_path, "--config-file", path.join(__dirname, "/../", "/doc", "/doc_config.json")], undefined, function(exit_code) {
			console.log(this.stdout, this.stderr)
         expect(parseInt(exit_code)).to.equal(5)
         done()

      })
    })
 })
