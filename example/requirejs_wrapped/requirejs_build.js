{
	baseUrl: "./",
  out: "builds/example_module.js",
  optimize: "uglify2",
	name: "example_module",
	wrap: {
		start: require("brace_umd").wrap_start.toString(),
		end: require("brace_umd").wrap_end.toString()
		//start: require("fs"),//.wrap_start,
		//end: require("fs")//.wrap_end
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
      		properties: false,
      },
      warnings: true,
      mangle: false
    }
}
