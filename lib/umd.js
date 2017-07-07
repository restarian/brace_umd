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

// TODO: Create a way to force a paticular type.
// TODO: Use brackit_print and create debug levels.
var umd = (function (root, module_name, deps, factory) {
	// This function is used to discover which platform the module should be defined with. The arguments can have a module_name or the parameter can
	// be omited entirely. It is typical for modules to auto-identify the module name so passing in only deps and a factory is customary. However,
	// the native global object (e.g. global or window), needs a module id to function. Therefore, a module id string should be used in order to create
	// modules which work between all three types. The module id parameter can never be supplied if the global native Object is never expected to be
	// used (only commonjs and amdefine are expected) .

	// Shift the values in the arguments object if the arguments only contain the deps and factory (setting arguments and parameters preform the
	// same action).
	if ( arguments.length === 3 ) {
		var deps_a = module_name
		factory = deps
		deps = deps_a
		module_name = undefined
		arguments[4] = factory
		// arguments must be manually adjusted when it is extended.
		arguments.length = arguments.length + 1
	}

	// These three test find the appropriate type of module type to define with.
  if ( typeof define === "function" && define.amd ) {

		console.log("Using amdefine to define the module", module_name || "")
		if ( arguments.length >= 4 )
			define(module_name, deps, factory)
		else
			define(deps, factory)
  }
	else if( typeof module === "object" && module.exports ) {

		console.log("Using CommonJS to define module", module_name || "")
		module.exports = factory.apply(factory, deps.map(function(value, index) { return require(value) }) )
  }
	else {

		console.log("Using the native global Object to define the module", module_name || "")
		if ( !module_name.toString() )
			console.warn("The global native Object is going to be used but the module is parameter is not available.")
		else if ( deps.every(
			// Loop through all of the dependencies passed in and bail if one of them is not already in the global native Object.
			function(value, index) {
				// Return true if the module dependency is available of false to exit the checking loop with a warning.
				return value in root || !!console.warn("The dependency", value, "is not loaded into the engine yet. Skipping loading of the module", module_name || "")
			})
		)
			root[module_name] = factory.apply(factory, deps.map(function(value, index) { return root(value) }) )
	}
})

// And the module is ironically defined using itself (cool huh??).
//umd(this, "umd", [], function() { return umd })
