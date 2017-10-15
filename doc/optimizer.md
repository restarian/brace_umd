# Brace UMD
### Using Brace UMD with the Requirejs optimizer

------

### Document pages
* [Synopsis](https://github.com/restarian/brace_umd/blob/master/doc/README.md)
* [(Re)building the source](https://github.com/restarian/brace_umd/blob/master/doc/build.md)
* [License information](https://github.com/restarian/brace_umd/blob/master/doc/license.md)
* [Available option data](https://github.com/restarian/brace_umd/blob/master/doc/options.md)
* [Passing in option data](https://github.com/restarian/brace_umd/blob/master/doc/passing_option_data.md)
* [Specifications](https://github.com/restarian/brace_umd/blob/master/doc/specification.md)
* [Todo](https://github.com/restarian/brace_umd/blob/master/doc/todo.md)

----

The *r.js* (requirejs optimizer), script also uses *uglify-js* so the options used in building the umd.js source are imported from the build directory which also contains the wrapping fragments. * Note: *Brace UMD* uses UglifyJS-3 and is not compatible with any other major versions.

Below is an example r.js build config json file where the umd source fragments and the build options which created the source are used. It is necessary to use *nodeRequire* and not *require* when fetching the brace_umd package because the r.js script creates an atypical require function for use internally which will not have the correct path available to find the brace_umd package.

```javascript
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
	 // This is how options are added via r.js build config.
 	 // end: nodeRequire("brace_umd").wrap_end_option({force_type: "factory"})
  }
}
```

The example above also displays the use of add_option to the wrap_end string exported by brace_umd. The wrap_end string is a String Object which has a add_option member. The function itself runs a fairly simple regex on the wrap_end fragment string (found in the build/wrap_end_umd_*[package version]*.frag file), which adds the option as the last argument of UMD enclosure function (see [definition types](https://github.com/restarian/brace_umd/blob/master/doc/definitions.md). Note: the wrap_end_option functionality does not work file locations when using *nodeRequire("brace_umd").wrap_end* for the *wrap.endFile* in the build config so it is best to always use the wrap_end string.


The wrap file location can be used instead of the string like below but the *add_option* member will not be available.

```javascript
...
wrap: {
  startFile: nodeRequire("brace_umd").wrap_start_file,
  endFile: nodeRequire("brace_umd").wrap_end_file
}
```



