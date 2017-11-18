{
	"baseUrl": "./",
  	"dir": "build",
	"optimize": "uglify2",
	"uglify2": nodeRequire("../../../").build_option,
	"modules": [
		{ "name": "entry" },
		{ "name": "base_module" }
	],
	"wrap": {
		// r.js redefines require and define again so make sure to use nodeRequire which will have the original require statement.
		"start": nodeRequire("../../../").wrap_start,
		"end": nodeRequire("../../../").wrap_end_option({force_type: "factory", auto_anonymous: true})
	}
}
