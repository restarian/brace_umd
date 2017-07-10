{
	baseUrl: "./",
  out: "builds/example.js",
  optimize: "uglify2",
	name: "example",
	wrap: {
		startFile: "umd",
		endFile: "umd", 
	}
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
