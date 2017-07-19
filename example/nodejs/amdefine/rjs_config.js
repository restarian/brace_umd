{
	name: "entry",
	baseUrl: "./",
  out: "build/example_module.js",
  //optimize: "uglify2",
  optimize: "none",
  //uglify2: nodeRequire("brace_umd").build_option_extend({output: {beautify: true}}),
  //uglify2: nodeRequire("brace_umd").build_option_extend(),
	wrap: {
		// r.js redefines requrie and define again so make sure to use nodeRequire which will have the original requie statment.
		start: nodeRequire("brace_umd").wrap_start,
		end: nodeRequire("brace_umd").wrap_end
	}
}
