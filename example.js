

var umd = require("brace_umd")

// This is the unified module definition function. If amdefine is already available here than it will use define(). If not, than module.exports
// or the global native Object will be used.
umd(this, "example_module", [], function() {

    console.log("Hello from example module")
})
