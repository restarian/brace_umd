{
	"baseUrl": "./",
  "dir": "../../../../brace_build",
	"optimize": "none",
	"modules": [
		{ "name": "entry" },
		{ "name": "base_module" }
	],
	"wrap": {
		// r.js redefines requrie and define again so make sure to use nodeRequire which will have the original require statment.
		"start": nodeRequire("brace_umd").wrap_start,
		"end": nodeRequire("brace_umd").wrap_end
	}
}
