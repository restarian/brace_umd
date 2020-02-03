## Adding the configuration files

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
  * **Requirejs project configuration**
  * [Using the optimizer](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/using_the_optimizer.md)
  * [What the build exports](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/what_the_build_exports.md)

---

### Adding the r_js configuration files to yout module:
The *template* directory of the Brace Umd project contains two requirejs configuration files.
* template/rjs_build_first.js
* template/rjs_build_second.js

Both of these files are necessary in order to use the Brace Umd process. After adding the files to a project, any external packages or libraries used in the project need to be listed in the paths entry of the r_js configuration. The first configuration file (with the "first* suffix in the name) needs to be ran with *r_js* first and the second file needs to be ran with *r_js* second.

The *paths* entry of the first configuration file needs to list any third party modules used in the with an ":empty" value so that the current build information of the project does not get used in the external modules (which are ideally optimized already).

E.g. if a module named *another* is included in the AMD call chain of a project than the paths entry of the first r_js configuration should contain:

```
{
  "paths": { "another": "empty:" }
}
```

..and the second r_js configuration should have the paths entry:

```
{
  "paths": { "another": nodeRequire.resolve("another").replace(/\.js\s*$/, "") }
}
```

For simpler projects, the above *paths* entry should be the only thing to alter when incorporating Brace Umd into modules.

**Important** When building the second r_js configuration file the a *suffix* option needs to be passed in by r_jj with the "_umd" set as its value for umd script output.

**Important**  the non-umd rjs configurations need to be ran first to avoid namespace collision in the build directory. This may be changed in later versions. This can be omitted if not using the umd script however.

A working example of the rjs_build configuratin files being executed from the package json file with npm:

```javascript

"scripts": {
  "build_config": "node ./node_modules/example_project/bin/build_umd.js --config-file uglify_option.json",
  "build_umd": "r_js -o ./rjs_build.js && r_js -o ./rjs_build_final.js suffix=\"_umd\"",
  "build_amd": "r_js -o ./rjs_build.js && r_js -o ./rjs_build_final.js",
  "build": "npm run build_config && npm run build_umd && npm run build_amd"
}
```
