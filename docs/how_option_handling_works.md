## Available option data

---
### Brace Umd help pages
* [Building the umd with other options](https://github.com/restarian/brace_umd/blob/master/docs/building_the_umd_with_other_options.md)
* **How option handling works**
* [Package information](https://github.com/restarian/brace_umd/blob/master/docs/package_information.md)
* [Passing option data to the umd](https://github.com/restarian/brace_umd/blob/master/docs/passing_option_data_to_the_umd.md)
* [Synopsis](https://github.com/restarian/brace_umd/blob/master/docs/synopsis.md)
* [Unit testing outline](https://github.com/restarian/brace_umd/blob/master/docs/unit_testing_outline.md)
* [Using the optimizer](https://github.com/restarian/brace_umd/blob/master/docs/using_the_optimizer.md)
* [What the build exports](https://github.com/restarian/brace_umd/blob/master/docs/what_the_build_exports.md)
* Specification
  * [Package information](https://github.com/restarian/brace_umd/blob/master/docs/specification/package_information.md)
  * [Unit test output](https://github.com/restarian/brace_umd/blob/master/docs/specification/unit_test_output.md)

---

**Options:**

* auto_anonymous: *Boolean*
	
This option will enable automatic creation of anonymous  amdefine modules. The last define call encountered inside the umd wrapper will have its id as A dependency requirement for a non-id define call. This will have module export a module value when a require is done within commonjs environments. However, it is only practical to use this when using the requirejs optimizer as the main entry module may not be defined lastly otherwise. Therefore, the *auto_anonymous* option should generally only be used via the ```nodeRequire("brace_umd").wrap_end_option({auto_anonymous: true})``` method.

* force_type: *String*

This option will convert all definition types into the one specified. E.g. ```{force_type: "requirejs"}``` will use requirejs as the only definition type even if *define* is specified in the module. This is possible because all AMD syntax is similar. E.g. *function(id, deps array, callback, err_callback)*

