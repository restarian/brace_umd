#  Brace Umd
## Project Specification Data


---
### Document pages
* [Synopsis](https://github.com/restarian/brace_umd/blob/master/docs/README.md)
* [Rebuilding the source](https://github.com/restarian/brace_umd/blob/master/docs/build.md)
* [Exported module data](https://github.com/restarian/brace_umd/blob/master/docs/exported_data.md)
* [License information](https://github.com/restarian/brace_umd/blob/master/docs/license.md)
* [Using brace umd with the requirejs optimizer](https://github.com/restarian/brace_umd/blob/master/docs/optimizer.md)
* [Available option data](https://github.com/restarian/brace_umd/blob/master/docs/options.md)
* [How to use option data](https://github.com/restarian/brace_umd/blob/master/docs/passing_option_data.md)
* [Module specifications](https://github.com/restarian/brace_umd/blob/master/docs/specification.md)
* [The todo list](https://github.com/restarian/brace_umd/blob/master/docs/todo.md)
* **Project specification data**

---
###  Provides a unified module definition wrapper for RequireJS and AMDefine definitions while staying seamlessly compliant with the RequireJS optimizer and factory based objects.

**Version**: 0.8.4

**Author**: [Robert Steckroth](mailto:RobertSteckroth@gmail.com)

**Technologies used in development**:
  * [VIM](https://vim.org) As an IDE
  * [Windows 10](https://www.microsoft.com/en-us/software-download/windows10) For unit testing and as the base operating system
  * [Ubuntu on Windows](https://www.microsoft.com/en-us/store/p/ubuntu/9nblggh4msv6) As the development operating environment
  * [Git](https://git-scm.com) For repository management
  * [Github](https://github.com) For repository storage
  * [NPM](https://npmjs.org) For module storage
  * [Blender](https://blender.org) For logo design and rendering

**License**: (MIT WITH BSD-2-Clause)

**Dependencies**: [bracket_print](https://npmjs.org/package/bracket_print) [commander](https://npmjs.org/package/commander)

**Development dependencies**: [amdefine](https://npmjs.org/package/amdefine) [brace_maybe](https://npmjs.org/package/brace_maybe) [bracket_utils](https://npmjs.org/package/bracket_utils) [chai](https://npmjs.org/package/chai) [mocha](https://npmjs.org/package/mocha) [requirejs](https://npmjs.org/package/requirejs) [uglify-js](https://npmjs.org/package/uglify-js)

**Optional Dependencies**: [brace_navlink](https://npmjs.org/package/brace_navlink)

**Package scripts**:

| Name | Action |
| ---- | ------ |
 | test | mocha |
 | build | ./bin/build_umd.js --config-file ./minified_config.json |
 | docs_build | ./bin/build_umd.js --config-file ./docs/doc_config.json |https://github.com/Microsoft/BashOnWindows) *for easy cross platform development*
* [VIM](www.vim.org) *As an IDE (ha)*
* [Git/Github](https://github.com) *for repository management and storage*
* [NPM](https://www.npmjs.com) *for package management*
* [Appveyor](https://www.appveyor.com) *for windows unit testing with older versions of things*
* [Travis Cl](https://travis-ci.org) *for ubuntu unit testing with older versions of things*
* [Blender](https://www.blender.org) *for 3d art creation*
* [Gimp Image Manipulator](https://www.gimp.org) *for document graphics media*
