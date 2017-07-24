{
	"baseUrl": "./",
  "dir": "build",
	"modules": [
		{
			"name": "entry"
			//"insertRequire": "entry",
	},
	{
		"name": "base_module"
		//"insertRequire": "base_module"
	} ],
  "optimize": "uglify2",
  //uglify2: nodeRequire("brace_umd").build_option_extend({output: {beautify: true}}),
  "uglify2": nodeRequire("brace_umd").build_option,
	"wrap": {
		// r.js redefines requrie and define again so make sure to use nodeRequire which will have the original require statment.
		"start": nodeRequire("brace_umd").wrap_start,
		"end": nodeRequire("brace_umd").wrap_end
	}
}
