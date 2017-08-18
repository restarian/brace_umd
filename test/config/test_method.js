var spawn = require("child_process").exec,
	path = require("path"),
	command_exist = require("command-exists")

module.exports = {

	Spinner: function() {

		this.cb = typeof arguments[3] === "function" && arguments[3] || function(){}
		this.err = typeof arguments[4] === "function" && arguments[4] || function(){}
		// If the parameter argument are not an Array than the value will be set as an Array.
		this.parameter = arguments[1] instanceof Array && arguments[1] || [arguments[1]||""]
		this.option = arguments[2]
		this.stdout = this.stderr = ""

		var command = (arguments[0] || this.default_command)

		this.error = function(error) {
			this.err.call(this, error)
		}
		this.standard_out = function(chunk) {
			this.stdout += chunk
		}
		this.standard_err = function(chunk) {
			this.stderr += chunk
		}
		this.exit = function(code) {
			// The build script will exit with code 5 unless it had an error in which case it is automatically logged.
			this.cb.call(this, code)
		}

		// In linux the on("error", function is not called when a non-available command is provided to spawn so this is the fix. 
		// See https://github.com/nodejs/node/issues/14871/ 
		command_exist(command, (function(err, success ) {
		
			if ( !success ) {
				this.error(err || new Error("Command not found: "+command))
			} 
			else {
		    	this._spinner = spawn(command + " " + this.parameter.join(" "), [], this.option)
				this._spinner.stdout.on("data", this.standard_out.bind(this))
				this._spinner.stderr.on("data", this.standard_err.bind(this))
				this._spinner.on("exit", this.exit.bind(this))
				this._spinner.on("error", this.error.bind(this))
		 	 }

		}).bind(this))

	}
}

