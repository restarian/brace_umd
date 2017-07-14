/*
Copyright (c) 2017 Robert Steckroth <RobertSteckroth@gmail.com>

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

(function(global_this, global_require, global_requirejs, global_define) {

  var umd = function() {
    var args = Array.prototype.slice.call(arguments)
    args.shift()
    arguments[0].apply(arguments[0].prototype, args)
	}

  var define = function() {
    var args = Array.prototype.slice.call(arguments)
    args.unshift(global_define || ( typeof module === "object" && module.exports && global_module ) || global_this)
    umd.apply(umd.prototype, args)
  }

  var require = function() {
    var args = Array.prototype.slice.call(arguments)
    // This will use the available require Object which can either be a requirejs require or the commonjs require. If not, than the global Object is used.
    args.unshift(global_require || global_this)
    umd.apply(umd.prototype, args)
  }

  var requirejs = function() {
    // Try to use the requirejs Object but fallback to the
    var args = Array.prototype.slice.call(arguments)
    args.unshift(global_requirejs || ( typeof module === "object" && module.exports && global_module ) || global_this)
    umd.apply(umd.prototype, args)
  }

  var global_module = function(id, dependancy, factory, err_cb) {
    // This will load the commonjs dependancies with either requirejs or the available require Object. It can be any one of those three sense they should all return an Object it
    // does not matter which one is uses.
    dependancy = dependancy || []
    // It is important to use the globally scoped requirejs or require objects to define the dependancy modules so that requirejs can be used in commonjs module
    // defines to fetch dependancies if it was available but to never try to add it to the module.exports again as the locally scoped requirejs would.
    module.exports = factory.apply(factory.prototype, dependancy.map(function(value, index) {
        return (global_requirejs || global_require)(value)
    }))
  }

  var global_this = function(id, dependancy, factory, err_cb) {

		if ( typeof id !== "string" )
			console.warn("The global native Object needs to be used but the module id parameter is not available.")
		else if ( dependancy.every(
			// Loop through all of the dependencies passed in and bail if one of them is not already in the global native Object.
			function(value, index) {
				// Return true if the module dependency is available of false to exit the checking loop with a warning.
				return value in global_this || !!console.warn("The dependency", value, "is not loaded into the factory yet. Skipping loading of the module", id)
			})
		)
			global_this[id] = factory.apply(factory, dependancy.map(function(value, index) { return global_this[value] }) )
  }

})(this, typeof require !== "undefined"&&require||undefined, typeof requirejs !== "undefined"&&requirejs||undefined, typeof define !== "undefined"&&define||undefined)
