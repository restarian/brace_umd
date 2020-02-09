## Running the project initialization tool

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
  * **The project initializer tool**
  * [Using the optimizer](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/using_the_optimizer.md)
  * [What the build exports](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/what_the_build_exports.md)

---


### Brace Umd can automatically setup your new project to use the standard build methodology.

Brace Umd comes with a tool that runs from the bin script *init_umd* which can be used at the command line or as an amd module library. Running the *-h* from the command line will show all of the available options.

Note: The script is safe and will not clobber data already within the json file or write over configuration files unless the *--force* flag us set.

### The project scripts entries
  The package.json (or another json) file can be modified to easily build projects using Brace Umd without remembering long commands or having to enter per-project configurations. This is possible due to the highly module nature of [Requirejs](https://github.com/requirejs) coupled with clever usage within the build configurations. To create scripts entries in your package.json (or another project configuration file), pass the *-s* flag to the *init_umd* script. The *--input-location* parameter can also be used to specify files elsewhere or with names other than package.json

### Copying the templates to the project base directory.
If the default configurations are not adequate and it is not ideal to make the changes from the *template* directory of the local Brace Umd module installation, than the *-t* flag can be used to copy the templates to the base directory of the project. It is important to note however, that if the scripts are already in place and the templates are copied over, the *--force* flag will need to be used in order to re-create the *scripts* entry data in the json file. Otherwise, the *scripts* entries will still point to the other template files even though the templates have been copied over. Exactly what occurred can be deduced by parsing verbose console output of the script as well.

### Below is a simple example of how to use the Initializer tool within a amd build:

Note: This script uses the awesome [comander](https://github.com/tj/commander.js) utility to handle option data therefor the module constructor option Object data should reflect the output of commander.parse() data.

```javascript
require("requirejs")(["init"], function(init) {
  // Commander options from the command line help menu are the same here.
  var option = {verbose: true, createScript: true, ...}
  init(option).run(function() {
    console.log("Success")
  }, function(error) {
    console.log(error)
  })
})
```
