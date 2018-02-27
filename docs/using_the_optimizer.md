## Using Brace UMD with the Requirejs optimizer

---
### Document pages
* [Building the umd with other options](https://github.com/restarian/brace_umd/blob/master/docs/building_the_umd_with_other_options.md)
* [How option handling works](https://github.com/restarian/brace_umd/blob/master/docs/how_option_handling_works.md)
* [Passing option data to the umd](https://github.com/restarian/brace_umd/blob/master/docs/passing_option_data_to_the_umd.md)
* [Synopsis](https://github.com/restarian/brace_umd/blob/master/docs/synopsis.md)
* **Using the optimizer**
* [What the build exports](https://github.com/restarian/brace_umd/blob/master/docs/what_the_build_exports.md)
* Specification
  * [License information](https://github.com/restarian/brace_umd/blob/master/docs/specification/license_information.md)
  * [Package specification](https://github.com/restarian/brace_umd/blob/master/docs/specification/package_specification.md)
  * [Unit test output](https://github.com/restarian/brace_umd/blob/master/docs/specification/unit_test_output.md)

---

#### Basic usage of Brace UMD with the Requirejs optimizer

The *r.js* (requirejs optimizer), script also uses *uglify-js* so the options used in building the umd.js source are imported from the build directory which also contains the wrapping fragments. 
**Note:** *Brace UMD* uses UglifyJS-3 and is not compatible with any other major versions of Uglify-js.

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
```

The example above also displays the use of *wrap_end_option* member exported by Brace umd to add option data to the UMD script. The function itself runs a fairly simple regex on the *wrap_end* String (found in the build/wrap_end_umd_*[package version]*.frag file), which adds the option as the last argument of UMD calling parenthesis (see [Exported module data ](https://github.com/restarian/brace_umd/blob/master/doc/exported_data.md)). 

**Note**: Option data can not be added if a file location is used for the end fragment. E.g. Using the *nodeRequire("brace_umd").wrap_end_file* in the *wrap.endFile* in the build config will never have any option data passed to it so it is best to use the *wrap_end* String. However, the *wrap_start_file* can be used with the *wrap.startFile* in the build config in conjunction with the *wrap_end_option* member to the *wrap.end* config setting. See example below.. 

```javascript
wrap: {
  startFile: nodeRequire("brace_umd").wrap_start_file,
  end: nodeRequire("brace_umd").wrap_end_option({force_type: "factory", auto_anonymous: true})
}
```

#### Optimizing modules which were built using Brace UMD or another UMD

All modules built with Brace UMD (or another UMD wrapper), should have two builds. The first build should contain the UMD wrapper which should also be the main module entry file. The other build file will not incorporate the UMD design practice. The requirejs optimizer build config snippet below shows how to build modules which do not inject dependency module UMD wrappers into new module build. Thusly, the build directory of modules should look like the example below.

```
my_module/
  package.json       <- in here should be: {.. main: build/my_module_umd.js ..}
  rjs_build.js       <- builds the non-UMD module my_module/build/my_module.js
  rjs_build_umd.js   <- builds the UMD wrapped module into my_module/build/my_module_umd.js
  lib/
  docs/
  build/ 
    my_module.js      <- contains non-UMD module
    my_module_umd.js  <- contains UMD wrapped module
```

Building modules which are wrapped with UMD script will cause superflurous UMD code to be placed into modules. This will result in multiple UMD wrappers to be placed in modules when the purpose of UMD is to only have one UMD wrapper per module file. However, the solution is simple when using requirejs. The *onBuildRead* configuration option needs to remove files which contain a "_umd.js" suffix and return the build file name which does not contain a UMD wrapper. 


```javascript

// A rjs_build.js snippet

"onBuildRead": function (module_name, module_path, content) { 
	// This is how a module is built which has dependency modules which use brace_umd. The non-brace_umd module version is used instead when a module is 
	// loaded which was a brace_umd built module (it will contain a _umd.js or -umd.js suffix). It is assumed that any module which contains a
	// [_,-]umd.js suffix is a UMD wrapped module.
	return /.+[_,-]umd\.js$/.test(module_path) && nodeRequire("fs").existsSync(module_path.replace(/[_,-]umd\.js$/, ".js")) && 
			nodeRequire("fs").readFileSync(module_path.replace(/[_,-]umd\.js$/, ".js")).toString() || content
}

```


