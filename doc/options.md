# Brace UMD
### Available option data

----
### Document pages

* [Synopsis](https://github.com/restarian/brace_umd/blob/master/doc/README.md)
* [(Re)building the source](https://github.com/restarian/brace_umd/blob/master/doc/build.md)
* [License information](https://github.com/restarian/brace_umd/blob/master/doc/license.md)
* [Using Brace UMD with the Requirejs optimizer](https://github.com/restarian/brace_umd/blob/master/doc/optimizer.md)
* [Passing in option data](https://github.com/restarian/brace_umd/blob/master/doc/passing_option_data.md)
* [Specifications](https://github.com/restarian/brace_umd/blob/master/doc/specification.md)
* [Todo](https://github.com/restarian/brace_umd/blob/master/doc/todo.md)

----

This page is a reference of the available options to the UMD wrapper.

**Options:**

	* auto_anonymous: *Boolean*
		This option will enable automatic creation of anonymouse amdefine modules. The last define call 
		encountered will have its id as a dependancy requirement for a non-id define call. This is only
		practical when using the requirejs optimizer however.

	* force_type: *String*
		This option will convert all definition types into the one specified. E.g. force_type: facory 
		requirejs will use requirejs as the only definition type even if *define* is specified in the 
		module. This is possible because all amd syntax is simular. E.g. *function(id, deps array,
		callback, err_callback)*
