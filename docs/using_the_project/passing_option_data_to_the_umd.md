## How to use option data

---
### Brace Umd help pages
* [Synopsis](https://github.com/restarian/brace_umd/blob/master/docs/synopsis.md)
* Contibutors
  * [Contributor code of conduct](https://github.com/restarian/brace_umd/blob/master/docs/contibutors/contributor_code_of_conduct.md)
  * [Guidelines for contributing](https://github.com/restarian/brace_umd/blob/master/docs/contibutors/guidelines_for_contributing.md)
* Specification
  * [License information](https://github.com/restarian/brace_umd/blob/master/docs/specification/license_information.md)
  * [Package information](https://github.com/restarian/brace_umd/blob/master/docs/specification/package_information.md)
  * [Unit test output](https://github.com/restarian/brace_umd/blob/master/docs/specification/unit_test_output.md)
* Using the project
  * [Building the umd with other options](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/building_the_umd_with_other_options.md)
  * [How option handling works](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/how_option_handling_works.md)
  * **Passing option data to the umd**
  * [Requirejs project configuration](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/requirejs_project_configuration.md)
  * [The prpject init tool](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/the_prpject_init_tool.md)
  * [Using the optimizer](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/using_the_optimizer.md)
  * [What the build exports](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/what_the_build_exports.md)

---

### Passing in option data to the UMD can happen in two ways.
#### First way

The option data can be manually added to the function call as parameter. The option data must be the last 
parameter and all of the other parameters must always remain in the call. The snippet below is an example 
of how to pass in the *auto_anonymous* option to the umd wrapper.
```javascript
}(this, typeof define === "function" && define || undefined,
	 typeof requirejs === "function" && requirejs || undefined, {auto_anonymous: true})
// Note: auto_anonymous should not be used as a 
```

#### Second way

Option data can be passed to the UMD wrapper via the *wrap_end_option({[option data]})* member contained
in the loaded commonjs module. This member will add the data to the UMD wrapper function call like above
and return the updated closing fragment. The closing fragment can then be used as a closing wrapper 
string in the optimizer build config. Below is how the requirejs build config uses the fragment and has 
the same result as the method above.
```javascript
wrap: {
 start: nodeRequire("brace_umd").wrap_start,
 end: nodeRequire("brace_umd").wrap_end_option({auto_anonymous: true})
}

```
	

