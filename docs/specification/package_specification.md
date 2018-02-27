

---
### Document pages
* [Building the umd with other options](https://github.com/restarian/brace_umd/blob/master/docs/building_the_umd_with_other_options.md)
* [How option handling works](https://github.com/restarian/brace_umd/blob/master/docs/how_option_handling_works.md)
* [Passing option data to the umd](https://github.com/restarian/brace_umd/blob/master/docs/passing_option_data_to_the_umd.md)
* [Synopsis](https://github.com/restarian/brace_umd/blob/master/docs/synopsis.md)
* [Using the optimizer](https://github.com/restarian/brace_umd/blob/master/docs/using_the_optimizer.md)
* [What the build exports](https://github.com/restarian/brace_umd/blob/master/docs/what_the_build_exports.md)
* Specification
  * [License information](https://github.com/restarian/brace_umd/blob/master/docs/specification/license_information.md)
  * **Package specification**
  * [Unit test output](https://github.com/restarian/brace_umd/blob/master/docs/specification/unit_test_output.md)

---
###  Provides a unified module definition wrapper for RequireJS and AMDefine definitions while staying seamlessly compliant with the RequireJS optimizer and factory based objects.

**Version**: 0.8.5

**Author**: [Robert Steckroth](mailto:RobertSteckroth@gmail.com)

**Dependencies**: [commander](https://npmjs.org/package/commander)

**Development dependencies**: [amdefine](https://npmjs.org/package/amdefine) [brace_maybe](https://npmjs.org/package/brace_maybe) [bracket_utils](https://npmjs.org/package/bracket_utils) [chai](https://npmjs.org/package/chai) [mocha](https://npmjs.org/package/mocha) [requirejs](https://npmjs.org/package/requirejs) [uglify-js](https://npmjs.org/package/uglify-js)

**Package scripts**:

| Name | Action |
| ---- | ------ |
 | test | mocha |
 | build | ./bin/build_umd.js --config-file ./minified_config.json |
 | docs_build | ./bin/build_umd.js --config-file ./docs/doc_config.json |

**Technologies used in development**:
  * [VIM](https://vim.org) As an IDE
  * [Windows 10](https://www.microsoft.com/en-us/software-download/windows10) For unit testing and as the base operating system
  * [Ubuntu on Windows](https://www.microsoft.com/en-us/store/p/ubuntu/9nblggh4msv6) As the development operating environment
  * [Git](https://git-scm.com) For repository management
  * [Github](https://github.com) For repository storage
  * [NPM](https://npmjs.org) For module storage
  * [Blender](https://blender.org) For logo design and rendering