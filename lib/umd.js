/*
Copyright (c) 2017 Robert Edward Steckroth

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

  Brace UMD is a unified module definition script to use when defining javascript modules.

  this file is a part of Brace UMD

 Author: Robert Edward Steckroth II, Bustout, <RobertSteckroth@gmail.com>
*/

(function (root, module_name, deps, factory) {

	if ( arguments.length === 3 ) {
		var deps_a = module_name
		factory = deps
		deps = deps_a
		module_name = undefined
		arguments[4] = factory
		arguments.length = arguments.length + 1
	}

  if ( typeof define === "function" && define.amd ) {

		console.log("Using amdefine to define the module")
		if ( arguments.length >= 4 )
			define(module_name, deps, factory)
		else
			define(deps, factory)
  } else if( typeof module === "object" && module.exports ) {

		console.log("Using commonjs to define the module")
		module.exports = factory.apply(factory, deps.map(function(value, index) { return require(value) }) )
  } else {

		console.log("Using the native global Object to define the module.")
		if ( !deps.every(function(value, index) {

			if ( !value in root )
				return !console.warn("The dependency", value, "is not loaded into the engine yet. Skipping loading of the entire module.")
			else
				return false
		}) )
		module_name = module_name || (document && document.location && document.location.href && document.location.href.replace(/.*\/(.*)\..+/, "$1"))
		if ( !module_name )
			console.log("A module id is manditory when native global Object defining is used.")
		else
			root[module_name] = factory.apply(factory, deps.map(function(value, index) { return root(value) }) )

	}
})
