
const { spawn } = require('child_process');
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.log('Failed to start subprocess.');
});

process.exit()
//require("./example/nodejs/amdefine/build/entry.js")
//require("./test.js")

//console.log(define.global)
var expect = require("chai").expect
//	spawn = require("child_process").exec,
var	path = require("path")
//	fs = require("fs")

var requirejs = require("requirejs")
requirejs.config({nodeRequire: require})


it("ddd", function(done) { 
		
		//var example_module_dir = path.join(process.cwd(), "/example", "/nodejs/", "/amdefine")
		var example_module_dir = path.join("./example", "/nodejs/", "/amdefine")
			
		var mod_path = path.join(example_module_dir, "/build", "/entry.js")

		requirejs(["require", mod_path], function(req) {

			console.log(1111, req("module_one"))		    	
		//	done()
//			expect(false).to.equal(false)
		})


})
