# Brace Umd
### Output of unit testing
 
----
### Brace Umd help pages
* [Synopsis](https://github.com/restarian/brace_umd/blob/master/docs/synopsis.md)
* Contibutors
  * [Contributor code of conduct](https://github.com/restarian/brace_umd/blob/master/docs/contibutors/contributor_code_of_conduct.md)
  * [Guidelines for contributing](https://github.com/restarian/brace_umd/blob/master/docs/contibutors/guidelines_for_contributing.md)
* Specification
  * [License information](https://github.com/restarian/brace_umd/blob/master/docs/specification/license_information.md)
  * [Package information](https://github.com/restarian/brace_umd/blob/master/docs/specification/package_information.md)
  * **Unit test output**
* Using the project
  * [Building the umd with other options](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/building_the_umd_with_other_options.md)
  * [How option handling works](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/how_option_handling_works.md)
  * [Passing option data to the umd](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/passing_option_data_to_the_umd.md)
  * [Requirejs project configuration](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/requirejs_project_configuration.md)
  * [The project initializer tool](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/the_project_initializer_tool.md)
  * [Using the optimizer](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/using_the_optimizer.md)
  * [What the build exports](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/what_the_build_exports.md)
----
 
### ---------- Start of unit testing ----------

  * Using stop further progression methodology for dependencies in: build_umd_cli_parameter.js
    * Checking for dependencies:
      * √ the build_umd program is available and at the right location
    * The build script
      * √ should export the correct build file with only the preamble option set to false
      * √ should provide a warning message when non-tested options which are attempted to be set
      * √ create the correct mangle build option output with the unit test file a
      * √ create the correct mangle and compress output with the unit test file b
      * √ should warn and exit when the tested-options file does not exist
      * √ a config file with non-uglify options errors and exits with code 11
      * √ a config file with nested Object mangle options works as expected
      * √ config file with all options set to false will export correctly
      * √ should not make the changes of non-tested build options which are attempted to be set
      * √ odd cli arguments are processed appropriately
      * √ the mangle option is omitted if mangle not specified at all
      * √ the mangle reserved options creates values as Array data if the value is non-array via the command line
      * √ the mangle reserved options creates values as Array data if Array syntax is set via the command line
      * √ the mangle reserved options create values as Array data if Array syntax is set via the config file (test/config/build_config_d.json
      * √ an empty config-file is accepted and used appropriately

  * Using stop further progression methodology for dependencies in: export_data.js
    * Checking for dependencies..
      * √ the build_umd program is available and at the right location
    * the module export data
      * √ using the build_umd.js script builds using the config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_a.json
      * √ the export member wrap_end_option returns the correct string with the option data added to it
      * √ the export member version is the same as the current one
      * √ using the build_umd.js script builds using the config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_b.json
      * √ the export member wrap_end_option returns the correct string with the option data added to it
      * √ the export member version is the same as the current one
      * √ using the build_umd.js script builds using the config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_c.json
      * √ the export member wrap_end_option returns the correct string with the option data added to it
      * √ the export member version is the same as the current one
      * √ using the build_umd.js script builds using the config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_d.json
      * √ the export member wrap_end_option returns the correct string with the option data added to it
      * √ the export member version is the same as the current one
      * √ using the build_umd.js script builds using the config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_e.json
      * √ the export member wrap_end_option returns the correct string with the option data added to it
      * √ the export member version is the same as the current one
      * √ using the build_umd.js script builds using the config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_f.json
      * √ the export member wrap_end_option returns the correct string with the option data added to it
      * √ the export member version is the same as the current one

  * Using stop further progression methodology for dependencies in: init_umd_cli.js
    * Checking for dependencies..
      * √ the build_umd program is available and at the right location
    * The init_umd script functions when using the cli invoked via node process
      * √ when the json file is not valid json data it returns error code 11
      * √ when the json file is valid json data and the --create-template flag is not set with the --force flag set
      * √ when the json file is valid json data and the --create-template flag is not set with the --force flag set
      * √ when the json file is valid json with a relative path for the input-location and the --create-template flag is set but the --force flag is not that the script is not altered
      * √ when the json file is valid json data and the --create-template flag is set and the --force flag is set that the data is altered
    * The init_umd script functions when using the npm run script
      * √ when the json file is not valid json data it returns error code 11
      * √ when the json file is valid json data and the --create-template flag is not set with the --force flag set
      * √ when the json file is valid json data and the --create-template flag is not set with the --force flag set
      * √ when the json file is valid json data and the --create-template flag is set but the --force flag is not that the script is not altered
      * √ when the json file is valid json with a relative path and the --create-template flag is set and the --force flag is set that the data is altered

  * Using stop further progression methodology for dependencies in: init_umd_module.js
    * Checking for dependencies..
      * √ the build_umd program is available and at the right location
      * √ r_js in the system as a program
    * The init.js api functions when using the library module with an amd loader
      * √ when the json file is not valid json data it returns error code 11
      * √ when the json file is valid json data and the --create-template flag is not set with the --force flag set
      * √ when the json file is valid json data and the --create-template flag is set but the --force flag is not that the script is not altered
      * √ when the json file is valid json data and the --create-template flag is set and the --force flag is set that the data is altered

  * Using stop further progression methodology for file dependencies: nodejs_amdefine_r_js_module_loading.js
    * Checking for dependencies:
      * √ requirejs in available to the module system
      * √ the build_umd program is available and at the right location
      * √ has all module dependencies available
    * Requirejs module loading after using r_js optimization on amdefined modules
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_c.json
        * √ will build the Brace umd source using the build_umd program
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\amdefine will build using the rjs_config_auto_anonymous.js file and the correct module values will load using amdefine with the make_anonymous option used
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\amdefine will build using the rjs_config_auto_anonymous.js file and the correct module values will load using commonjs require with the make_anonymous option used
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\amdefine will build using the rjs_config.js file and the correct module values will load using amdefine

  * Using stop further progression methodology for file dependencies: nodejs_factory_manually_created_module_loading.js
    * Checking for dependencies..
      * √ the build_umd program is available and at the right location
    * nodejs require loading after r_js optimization on modules using the factory
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_a.json
        * √ after building the brace umd source
        * a non-requirejs-optimized factory implementation
          * √ with and without the auto_anonymous option set will return the correct data when using only a callback as the definition parameter
          * √ without the auto_anonymous option set will return the correct data
          * √ will not load the module if it specifies an unavailable dependency
          * √ will load the require dependency as the require function
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_b.json
        * √ after building the brace umd source
        * a non-requirejs-optimized factory implementation
          * √ with and without the auto_anonymous option set will return the correct data when using only a callback as the definition parameter
          * √ without the auto_anonymous option set will return the correct data
          * √ will not load the module if it specifies an unavailable dependency
          * √ will load the require dependency as the require function
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_c.json
        * √ after building the brace umd source
        * a non-requirejs-optimized factory implementation
          * √ with and without the auto_anonymous option set will return the correct data when using only a callback as the definition parameter
          * √ without the auto_anonymous option set will return the correct data
          * √ will not load the module if it specifies an unavailable dependency
          * √ will load the require dependency as the require function
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_d.json
        * √ after building the brace umd source
        * a non-requirejs-optimized factory implementation
          * √ with and without the auto_anonymous option set will return the correct data when using only a callback as the definition parameter
          * √ without the auto_anonymous option set will return the correct data
          * √ will not load the module if it specifies an unavailable dependency
          * √ will load the require dependency as the require function
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_e.json
        * √ after building the brace umd source
        * a non-requirejs-optimized factory implementation
          * √ with and without the auto_anonymous option set will return the correct data when using only a callback as the definition parameter
          * √ without the auto_anonymous option set will return the correct data
          * √ will not load the module if it specifies an unavailable dependency
          * √ will load the require dependency as the require function
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_f.json
        * √ after building the brace umd source
        * a non-requirejs-optimized factory implementation
          * √ with and without the auto_anonymous option set will return the correct data when using only a callback as the definition parameter
          * √ without the auto_anonymous option set will return the correct data
          * √ will not load the module if it specifies an unavailable dependency
          * √ will load the require dependency as the require function

  * Using stop further progression methodology for file dependencies: nodejs_factory_r_js_module_loading.js
    * Checking for dependencies:
      * √ requirejs in available to the module system
      * √ the build_umd program is available and at the right location
    * nodejs require loading after r_js optimization on modules using the factory
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_a.json with r_js
        * √ after building the brace umd source
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\factory will build using the rjs_config_force_factory.js file with force type of factory and the correct module values will load using commonjs require
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\factory will build using the rjs_config_force_factory_auto_anonymous.jsfile with force type of factory and the correct module values will load using commonjs require
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_b.json with r_js
        * √ after building the brace umd source
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\factory will build using the rjs_config_force_factory.js file with force type of factory and the correct module values will load using commonjs require
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\factory will build using the rjs_config_force_factory_auto_anonymous.jsfile with force type of factory and the correct module values will load using commonjs require
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_c.json with r_js
        * √ after building the brace umd source
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\factory will build using the rjs_config_force_factory.js file with force type of factory and the correct module values will load using commonjs require
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\factory will build using the rjs_config_force_factory_auto_anonymous.jsfile with force type of factory and the correct module values will load using commonjs require
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_d.json with r_js
        * √ after building the brace umd source
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\factory will build using the rjs_config_force_factory.js file with force type of factory and the correct module values will load using commonjs require
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\factory will build using the rjs_config_force_factory_auto_anonymous.jsfile with force type of factory and the correct module values will load using commonjs require
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_e.json with r_js
        * √ after building the brace umd source
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\factory will build using the rjs_config_force_factory.js file with force type of factory and the correct module values will load using commonjs require
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\factory will build using the rjs_config_force_factory_auto_anonymous.jsfile with force type of factory and the correct module values will load using commonjs require
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_f.json with r_js
        * √ after building the brace umd source
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\factory will build using the rjs_config_force_factory.js file with force type of factory and the correct module values will load using commonjs require
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\factory will build using the rjs_config_force_factory_auto_anonymous.jsfile with force type of factory and the correct module values will load using commonjs require

  * Using stop further progression methodology for file dependencies: nodejs_requirejs_amdefine_r_js_module_loading.js
    * Checking for dependencies:
      * √ requirejs in available to the module system
      * √ the build_umd program is available and at the right location
      * √ has all module dependencies available
    * Requirejs module loading after using r_js optimization on amdefined modules
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_a.json
        * √ after building the brace umd source
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using requirejs
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using amdefine
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using amdefine
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_b.json
        * √ after building the brace umd source
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using requirejs
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using amdefine
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using amdefine
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_c.json
        * √ after building the brace umd source
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using requirejs
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using amdefine
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using amdefine
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_d.json
        * √ after building the brace umd source
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using requirejs
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using amdefine
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using amdefine
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_e.json
        * √ after building the brace umd source
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using requirejs
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using amdefine
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using amdefine
      * using config file C:\Users\Rober\Worklog\node_modules\brace_umd\test\config\build_config_f.json
        * √ after building the brace umd source
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using requirejs
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using amdefine
        * √ the example module at C:\Users\Rober\Worklog\node_modules\brace_umd\test\example\nodejs\requirejs_amdefine will build using the rjs_config.js file and the correct module values will load using amdefine

  * Using stop further progression methodology for file dependencies: zzz_run_me_last.js
    * Checking for dependencies:
      * √ the build_umd program is available and at the right location
    * This test is ran to build the project source back to the default because the unit tests
      * √ this test is to build the project as the doc pages were

  * 139 passing


### ---------- End of unit testing ----------