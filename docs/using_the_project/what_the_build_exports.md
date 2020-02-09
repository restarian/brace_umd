## Exported module data 

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
  * [Passing option data to the umd](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/passing_option_data_to_the_umd.md)
  * [Requirejs project configuration](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/requirejs_project_configuration.md)
  * [The project initializer tool](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/the_project_initializer_tool.md)
  * [Using the optimizer](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/using_the_optimizer.md)
  * **What the build exports**

---

The UMD module exports data relating to the current built version of UMD wrapper. The data can be obtained using ```require("brace_umd")``` and correlates to the current module version and the last run of the *build_umd* program. 
Note: A *nodeRequire* should be used instead of *require* when using this data in a requirejs build config file.

Below is a description of the available data in the module accessed via *require("brace_umd")*:

* umd: *String* - Contains the entire UMD script after building with the *build_umd* program. It will reflect options passed to *build_umd* for uglify-js	

* build_option: *Object* - Contains the options used to build the UMD script. This Object can be passed directly to the requriejs optimizer as well.

* build_option_extend: *Function(Object)* - This function returns the build_option Object and also adds any data passed into it. Any data passed in will overwrite the current data. This return Object will conform to the expectations of *Uglify-js* option data if the Object passed in also conforms to the *Uglify-js* expections.

* build_information: *Object* - A Object containing the meta data for the current version and build.

	* tested_options_file: *String* - The file which was used to specify the allowed options to be used with *build_umd* program.

	* version: *String* - The current module package version (same as in the package.json). This is used to prefix the build data file names.

	* build_directory: *String* - The directory which contains all of the built umd files and data. All files in this directory will be prefixed with the version.

* build_program_path: "String* - The path to the *build_umd* program used by the module.

* wrap_start_file: *String* - The file location of the starting wrap fragment. This can be used in the requirejs build config as the ```wrap.startfile```option. 

* wrap_end_file: *String* - The file location of the ending wrap fragment. This can be used in the requirejs build config as the ```wrap.endFile```option.


**Note**: UMD wrapper option data can not be used with file locations so it is advised to use *wrap_end* and *wrap_end_option* members instead.


* wrap_start: *String* - This contains the UMD starting fragment wrapper as a String and can be used in the requirejs optimizer build config for the ```wrap.start``` option.

* wrap_end: *String* - This contains the UMD ending fragment wrapper as a String and can be used in the requirejs optimizer build config for the ```wrap.end``` option.

* wrap_end_option: *Function(Object)* - This function retrurns the same String as the *wrap_end* member does. However, any Object data passed in as a parameter will be added as option data by altering the String returned.

