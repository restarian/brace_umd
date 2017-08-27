var path = require("path"),
	maybe = require("mocha-maybe"),
	Spinner = require("process-wrap").Spinner,
	requirejs = require("requirejs")

// Adding node to the command string will help windows know to use node with the file name. The unix shell knows what the #! at the beginning
// of the file is for but windows will complain. The build_umd.js source will run if the spinner command is empty by setting the default_command member.
Spinner.prototype.default_command = "node" 

var example_module_dir = "./example/nodejs/factory/"

///requirejs.optimize({}, function() { console.log(111, arguments) }, function() { console.log(222, arguments) })


new Spinner("r_js", ["-o", path.join(example_module_dir, "/rjs_config.js")], undefined, function() { 

	console.log("111111111111fffdeee", this.stdout)
}, function(err) {
	
	console.log("222222222222222", err, this.stdout, this.stderr)
})
