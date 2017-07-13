
# Brace UMD
### Using Brace UMD with the RequireJs r.js optimizer

------

### Document pages
* [Front Page](https://github.com/restarian/brace_umd/blob/master/README.md)
* [Building UMD source](https://github.com/restarian/brace_umd/blob/master/doc/build.md)
* [Specification](https://github.com/restarian/brace_umd/blob/master/doc/specification.md)
* [License](https://github.com/restarian/brace_umd/blob/master/doc/todo.md)
* [Todo](https://github.com/restarian/brace_umd/blob/master/doc/todo.md)

----
Example requiejs build file:

    {
    	baseUrl: "./",
      out: "builds/example_module.js",
      optimize: "uglify2",
      uglify2: nodeRequire("brace_umd").build_option,
    	name: "example_module",
    	wrap: {
    		// r.js redefines require and define again so make sure to use nodeRequire which will have the original require statement.
    		start: nodeRequire("brace_umd").wrap_start,
    		end: nodeRequire("brace_umd").wrap_end
    	}
    }

The r.js command will also use uglify-js so the options are imported from the build directory which will store the options used to build the fragments there.
