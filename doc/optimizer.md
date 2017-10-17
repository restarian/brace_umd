# Brace UMD
### Using Brace UMD with the Requirejs optimizer

------

### Document pages
* [Synopsis](https://github.com/restarian/brace_umd/blob/master/doc/README.md)
* [(Re)building the source](https://github.com/restarian/brace_umd/blob/master/doc/build.md)
* [Exported module data ](https://github.com/restarian/brace_umd/blob/master/doc/exported_data.md)
* [License information](https://github.com/restarian/brace_umd/blob/master/doc/license.md)
* [Available option data](https://github.com/restarian/brace_umd/blob/master/doc/options.md)
* [How to use option data](https://github.com/restarian/brace_umd/blob/master/doc/passing_option_data.md)
* [Specifications](https://github.com/restarian/brace_umd/blob/master/doc/specification.md)
* [Todo](https://github.com/restarian/brace_umd/blob/master/doc/todo.md)

----

The *r.js* (requirejs optimizer), script also uses *uglify-js* so the options used in building the umd.js source are imported from the build directory which also contains the wrapping fragments. * Note: *Brace UMD* uses UglifyJS-3 and is not compatible with any other major versions.

Below is an example requirejs build config json file where the umd source fragments and the build options which created the source are used. It is necessary to use *nodeRequire* and not *require* when fetching the brace_umd package because the r.js script creates an atypical require function for use internally which will not have the correct path available to find the brace_umd package.

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
	 // This is how options are added to the UMD script when using the r.js build config.
 	 // end: nodeRequire("brace_umd").wrap_end_option({force_type: "factory"})
  }
}
``

The example above also displays the use of *wrap_end_option* member exported by Brace umd to add option data to the UMD script. The function itself runs a fairly simple regex on the *wrap_end* String (found in the build/wrap_end_umd_*[package version]*.frag file), which adds the option as the last argument of UMD calling parenthesis (see [Exported module data ](https://github.com/restarian/brace_umd/blob/master/doc/exported_data.md)). 

**Note**: Option data can not be added if a file location is used for the end fragment. E.g. Using the *nodeRequire("brace_umd").wrap_end_file* in the *wrap.endFile* in the build config will never have any option data passed to it so it is best to use the *wrap_end* String. However, the *wrap_start_file* can be used with the *wrap.startFile* in the build config in conjunction with the *wrap_end_option* member to the *wrap.end* config setting. See example below.. 

```javascript
wrap: {
  startFile: nodeRequire("brace_umd").wrap_start_file,
  end: nodeRequire("brace_umd").wrap_end_option({force_type: "factory", auto_anonymous: true})
}
```
