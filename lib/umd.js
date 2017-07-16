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

(function() {
  // This is the unified module definition script. It wraps all other module definition syntax and applies the appropriate mechanism to it. The two parameters passed in
  // is the native global Object to use as the factory if all the others are not available and can be any Object and the options Object. The options can also be set to the
  // first parameter and supercede the second parameter. It is also acceptable to not pass any parameters to this function and have the script output a message if it is
  // ever requested. The umd qualifier is the only other additional namespace which is added to this scope (other than the module definition types).
  var umd = {

    // These values here are expected to be global until the script function completely loads so it is important that this is parsed before the rest of the function body.
    requirejs: (typeof requirejs !== "undefined" && requirejs) || undefined,
    define: (typeof define !== "undefined" && define) || undefined,
    require: (typeof require !== "undefined" && require) || (typeof module !== "undefined" && module.require.bind(module)) || undefined,
    support: {"require": true, "requirejs": true, "define": true},
    factory: arguments[0],
    force_type: (arguments[0] && arguments[0].force_type) || (arguments[1] && arguments[1].force_type),
    // use does not need to have a umd Object prototype so it can be defined here instead of being bound like the global_object and commonjs members are.
    use: function() {
      // This will call the global Object passed into the primary function as parameters (which is now the first argument).
      var args = Array.prototype.slice.call(arguments)
      // Remove the global Object from the arguments (the others will be typical of module definitions).
      args.shift()
      arguments[0].apply(arguments[0].prototype, args)
    }
  }

  umd.global_object = (function(id, dependancy, factory, err_cb) {
    // This method will add the module to the native global Object. The dependencies will have to be already added to the Object before this module is called.
    // The module will fail to load with a message if ANY dependencies are unavailable. It is then up to the developer to re-order the modules so they load in
    // the correct order. A string id is required to define the module if the platform is a browser.

    if ( id && id.constructor === Array && this.require && this.require.filenmame ) {
      // The arguments can be re-ordered+ so that it contains an id (only in commonjs however).
      var i = id, d = dependancy, f = factory, e = err_cb
      err_cb = f
      factory = d
      dependancy = i
      id = this.require.filenmame
    }
    if ( typeof id !== "string" ) console.log("The global native Object is attempted to be used but the module does not supply an id parameter. Skipping loading of the module.")
    else if ( dependancy.every(function(value, index) {
        return value in this.factory || !!console.log("The dependency", value, "is not loaded into the factory yet. Skipping loading of the module", id)
    }, this) )
      this.factory[id] = factory.apply(factory, dependancy.map(function(value, index) {
        return this.factory[value]
    }, this))
  }).bind(umd)

  umd.commonjs = (function(id, dependency, factory, err_cb) {
    // This will define the module with the commonjs mechanism. The dependancy array will also need to use the commonjs require functionality.

    if ( id && id.constructor === Array ) {
      var i = id, d = dependency, f = factory, e = err_cb
      err_cb = f
      factory = d
      dependency = i
    }

    module.exports = factory.apply(factory.prototype, dependency.map(function(value, index) {

      // umd.require is the commonjs module require Object. The dependencies are looped over and returned unless it does not exist.
      var m = null
      try { m = this.require(value) }
      catch(e) {
        if ( typeof err_cb !== "function" )
          console.log(e.message);
      }

      if ( !m && typeof err_cb === "function" ) {
        err_cb();
        m = {}
      }
      return m

    }, this))
  }).bind(umd)

  // Check to see if the force_type option is set in the provided native global Object or as a second argument.
  if ( umd.force_type )
    if ( !(umd.force_type in umd.support) ) {
      console.log("The forced type", umd.force_type, "specified as an option is not supported by Brace UMD. Supported types are", Object.keys(umd.support))
    } else if ( !umd[umd.force_type] ) {
      console.log("The forced type", umd.force_type, "is not available.")
    } else {
      // Set all of the define types to the forced type so that it is only ever called.
      umd.requirejs = umd.require = umd.define = umd.factory = umd[umd.force_type]
    }

  var define = function() {
    // Turn the arguments Object into an Array (which is easier to manipulate).
    var args = Array.prototype.slice.call(arguments)
    // Global define is the amdefine Object if it was available (otherwise it will be undefined). If amdefine is not available than check for
    // the module.exprts Object and use commonjs. When all else fails, use the native global Object.
    args.unshift(umd.define || typeof module === "object" && module.exports && umd.commonjs || umd.global_object)
    umd.use.apply(umd.use.prototype, args)
  }

  var require = function() {
    var args = Array.prototype.slice.call(arguments)
    // Add the global Object to the arguments. require will always be available in nodejs and may be elsewhere. If the browser is used and require
    // is not present than the native global Object will be used.
    args.unshift(umd.require || global_object)
    umd.use.apply(umd.use.prototype, args)
  }

  var requirejs = function() {
    var args = Array.prototype.slice.call(arguments)
    // umd.requirejs is the requirejs Object if it was available.
    args.unshift(umd.requirejs || typeof module === "object" && module.exports && umd.commonjs || umd.global_object)
    umd.use.apply(umd.use.prototype, args)
  }

  // --- Module definitions are added here

  define("dds", ["test_module_two"], function(one, two) {
    console.log("Init my_module")
    return {one: one, two: two}
  })

  // -----------

// force_type is the only option thus far and can be set to the global Object (first parameter), or the second parameter as an Object.
})(this, {force_type: "factory"}/* Both of these parameters are optional */)
