
// Adding node to the command string will help windows know to use node with the file name. The unix shell knows what the #! at the beginning
// of the file is for.
var spawn = require("child_process").exec,
	path = require("path")

module.exports = {

	Spinner: function() {

		this.cb = typeof arguments[3] === "function" && arguments[3] || function(){}
		this.err = typeof arguments[4] === "function" && arguments[4] || function(){}
		this.parameters = arguments[1] instanceof Array && arguments[1] || [arguments[1]||""]
		this.stdout = this.stderr = ""
		var command = (arguments[0] || "node "+path.join(process.cwd(), "/bin", "/build_umd.js ")) + " " + this.parameters.join(" ")
		this._spinner = spawn(command, [], arguments[2])

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
		   if ( code !== 5 )
				console.log(this.stdout)
			this.cb.call(this, code)
		}

		this._spinner.stdout.on("data", this.standard_out.bind(this))
		this._spinner.stderr.on("data", this.standard_err.bind(this))
		this._spinner.on("exit", this.exit.bind(this))
		this._spinner.on("error", this.error.bind(this))

	}
}

