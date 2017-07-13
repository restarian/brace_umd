
# Brace UMD
### Using Brace UMD with the RequireJs r.js optimizer

------

### Document pages
* [Front Page](https://github.com/restarian/brace_umd/blob/master/README.md)
* [Building UMD source](https://github.com/restarian/brace_umd/blob/master/doc/build.md)
* [Specification](https://github.com/restarian/brace_umd/blob/master/doc/specification.md)
* [Licenses](https://github.com/restarian/brace_umd/blob/master/doc/license.md)
* [Todo](https://github.com/restarian/brace_umd/blob/master/doc/todo.md)

----

The *r.js* program also uses *uglify-js* so those options are imported from the build directory which created the build the fragments. Any uglify2 options set in the build file will overwrite the build source as it is re-minifies by *uglify-js*. This may be desirable so it is acceptable to supply new *uglify-js* options there.
  * Note: *Brace UMD* uses UglifyJS-3 and is not compatible with any other major versions.

Example requiejs build file:

    {
      baseUrl: "./",
      out: "builds/example_module.js",
      optimize: "uglify2",
      // Get the exported build options from the build_umd script and use those again.
      uglify2: nodeRequire("brace_umd").build_option,
    	name: "example_module",
    	wrap: {
    		// r.js redefines require and define again so make sure to use nodeRequire which will have the original require statement.
    		start: nodeRequire("brace_umd").wrap_start,
    		end: nodeRequire("brace_umd").wrap_end
    	}
    }

The wrap file location can be used instead of the string. E.g.

    ...
    wrap: {
    		startFile: nodeRequire("brace_umd").wrap_start_file,
    		endFile: nodeRequire("brace_umd").wrap_end_file
    }
