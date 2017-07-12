{
	baseUrl: "./",
  out: "builds/example_module.js",
  optimize: "uglify2",
	name: "example_module",
	wrap: {
		// r.js redefines requrie and define again so make sure to use nodeRequire which will have the original requie statment.
		start: nodeRequire("brace_umd").wrap_start,
		end: nodeRequire("brace_umd").wrap_end
	},
  uglify2: {
      output: {
          beautify: true
      },
      compress: {
          sequences: false,
          global_defs: {
              DEBUG: false
          },
      		unsafe: true,
					unused: false,
      		properties: false,
      },
      warnings: true,
      mangle: false
    }
}
