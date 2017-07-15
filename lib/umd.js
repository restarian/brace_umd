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

(function(global_factory /* optional */) {
  // This is the unified module definition script. It wraps all other module definition syntax and applies the appropriate mechanism to it. The only parameter passed in
  // is the native global Object to use as the factory if all the others are not available and can be any Object. It is also acceptable to not pass the global Object in
  // and have the script output a message if it is needed.
  var global_requirejs = (typeof requirejs !== "undefined" && requirejs) || undefined
  var global_define = (typeof define !== "undefined" && define) || undefined
  var global_require = (typeof require !== "undefined" && require) || (module && module.require.bind(module)) || undefined

    var umd = function() {
        // This will call the global Object passed into the primary function as parameters (which is now the first argument).
        var args = Array.prototype.slice.call(arguments)
        // Remove the global Object from the arguments (the others will be typical of module definitions).
        args.shift()
        arguments[0].apply(arguments[0].prototype, args)
    }
    var define = function() {
        // Turn the arguments Object into an Array (which is easier to manipulate).
        var args = Array.prototype.slice.call(arguments)
        // Global define is the amdefine Object if it was available (otherwise it will be undefined). If amdefine is not available than check for
        // the module.exprts Object and use commonjs. When all else fails, use the native global Object.
        args.unshift(global_define || typeof module === "object" && module.exports && commonjs || global_object)
        umd.apply(umd.prototype, args)
    }
    var require = function() {
        var args = Array.prototype.slice.call(arguments)
        // Add the global Object to the arguments. require will always be available in nodejs and may be elsewhere. If the browser is used and require
        // is not present than the native global Object will be used.
        args.unshift(global_require || global_object)
        umd.apply(umd.prototype, args)
    }
    var requirejs = function() {
        var args = Array.prototype.slice.call(arguments)
        // global_requirejs is the requirejs Object if it was available.
        args.unshift(global_requirejs || typeof module === "object" && module.exports && commonjs || global_object)
        umd.apply(umd.prototype, args)
    }
    var commonjs = function(id, dependancy, factory, err_cb) {
        // This will define the module with the commonjs mechanism. The dependancy array will also need to use the commonjs require functionality.
        dependancy = dependancy || []
        module.exports = factory.apply(factory.prototype, dependancy.map(function(value, index) {
            // global_require is the commonjs require Object.
            return global_require(value)
        }))
    }
    var global_object = function(id, dependancy, factory, err_cb) {
        // This method will add the module to the native global Object. The dependancies will have to be already added to the Object before this module is called.
        // The module will fail to load with a message if ANY dependancies are unavailable. It is then up to the developer to reorder the modules so they load in
        // the correct order. A string id is required to define the module if the platform is a browser.

        if ( id && id.constructor === Array ) {
            var i = id, d = dependancy, f = factory, e = err_cb
            err_cb = f
            factory = d
            dependancy = i
            id = __filename.replace(/.*[\\,\/]/g, "")
        }
        if (typeof id !== "string") console.log("The global native Object needs to be used but the module id parameter is not available.")
        else if (dependancy.every(function(value, index) {
            return value in global_factory || !!console.log("The dependency", value, "is not loaded into the factory yet. Skipping loading of the module", id)
        })) global_factory[id] = factory.apply(factory, dependancy.map(function(value, index) {
            return global_factory[value]
        }))
    }

})(this /* optional */)
