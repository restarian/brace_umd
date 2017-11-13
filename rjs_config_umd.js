{
	"baseUrl": "./lib",
	"out": "build/brace_prototype.js",
	"name": "brace_prototype",
	"optimize": "uglify2",
	"uglify2": nodeRequire("brace_umd").build_option_extend({output: {beautify: true}, mangle: {properties: false}}),
	"wrap": {
		// r.js redefines require and define again so make sure to use nodeRequire which will have the original require statement.
		"start": nodeRequire("brace_umd").wrap_start,
		"end": nodeRequire("brace_umd").wrap_end_option({"auto_anonymous": true})
	}
}
