## Running the project initialization tool

---
### Document pages

---


### Brace Umd can automatically setup your new project to use the standard build methodology.

Brace Umd comes with a tool that runs from the bin script *init_umd* which can be used at the command line or as an amd module library. Running the *-h* from the command line will show all of the available options.

Note: The script is safe and will not clobber data already within the json file or write over configuration files unless the *--force* flag us set.

The *--input-location* parameter can also be used to specify package json configuration files elsewhere or with file names other than *package.json*. Otherwise, if the parameter is omitted, the base url is determined by the nearest git repoitory root directory in regards to the *process.cwd()* directory.

### The project scripts entries
The package.json (or another json) file can be modified to easily build projects using Brace Umd without remembering long commands or having to enter per-project configurations. This is possible due to the highly module nature of [Requirejs](https://github.com/requirejs) coupled with clever usage within the build configurations. To create scripts entries in your package.json (or another project configuration file), pass the *--create-script* flag to the *init_umd* script. 

### Copying the templates to the project base directory.
The *--create-template* flag can be used to copy the template files to the base url of the project. If the scripts are already in place and the *init_umd* command is ran, the *--force* flag will need to be used in order to re-copy the templates over the existing ones. Note: What occurred in script execution can be deduced by parsing verbose console output of the script.

**An example of command line usage: .\node_modules\.bin\init_umd -vst**

### Below is a simple example of how to use the Initializer tool within a amd build:

Note: The Initializer tool uses the [comander](https://github.com/tj/commander.js) utility to handle option data therefor the module constructor option Object data should reflect the output of commander.parse() data.

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
