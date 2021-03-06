{
	"_init": !!module.paths.unshift(nodeRequire("path").join(config.baseUrl, "../../../../../")),
	"baseUrl": "lib",
  	"dir": "build",
	"optimize": "uglify2",
	"uglify2": nodeRequire("brace_umd").build_option_extend({mangle: {properties: {reserved: ["config"]}}}),
	"modules": [
		{ "name": "entry" },
		{ "name": "base_module" }
	],
	"wrap": {
		// r.js redefines require and define again so make sure to use nodeRequire which will have the original require statement.
		"start": nodeRequire("brace_umd").wrap_start,
		"end": nodeRequire("brace_umd").wrap_end_option({"auto_anonymous": true})
	}
}
