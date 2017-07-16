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
    module: (typeof module !== "undefined" && module) || undefined,
    _factory: arguments[0] || undefined,
    support: {"requirejs": true, "define": true, "factory": true},
    force_type: (arguments[0] && arguments[0].force_type) || (arguments[1] && arguments[1].force_type),
    rjs_properties: [ "config", "nextTick", "version", "jsExtRegExp", "isBrowser", "s", "toUrl", "undef", "defined", "specified", "onError", "createNode", "load", "exec" ],
    rjs: function() {

      if ( umd.module && !umd.requirejs )
        try {
          umd.requirejs = umd.module.require("requirejs")
          for ( var p in umd.requirejs )
            umd.rjs[p] = umd.requirejs[p]
        }
        catch(e) { console.log(e.message) }

      var use_type = (umd.requirejs || umd.factory)
      use_type.apply(use_type.prototype, arguments)
    },
  }

  for ( var o in umd.rjs_properties )
    umd.rjs.__defineGetter__(umd.rjs_properties[o], (function(key) {

    if ( umd.module )
      try {
        umd.requirejs = umd.module.require("requirejs")
        for ( var p in umd.requirejs )
          umd.rjs[p] = umd.requirejs[p]
      }
      catch(e) { console.log(e.message) }
      console.log(key)
      return umd.requirejs[key]
    }).bind(null, umd.rjs_properties[o]))

  umd.factory = umd._factory && (function(id, dependancy, callback, error_callback) {
    // This method will add the module to the native global Object. The dependencies will have to be already added to the Object before this module is called.
    // The module will fail to load with a message if ANY dependencies are unavailable. It is then up to the developer to re-order the modules so they load in
    // the correct order. A string id is required to define the module if the platform is a browser.

    if ( id && id.constructor === Array && this.module ) {
      // Shift the arguments over sense the id string is not always required.
      var i = id, d = dependency, cb = callback, err_cb = error_callback
      error_callback = err_cb
      callback = cb
      dependency = i
      id = this.module.filenmame
    }

    console.log("Using factory for module", id)
    if ( typeof id !== "string" ) console.log("The global native Object is attempted to be used but the module does not supply an id parameter. Skipping loading of the module.")
    else if ( dependancy.every(function(value, index) {
        return value in this.factory || !!console.log("The dependency", value, "is not loaded into the factory yet. Skipping loading of the module", id)
    }, this) )
      this._factory[id] = callback.apply(callback.prototype, dependancy.map(function(value, index) {
        return this._factory[value]
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
      console.log("Forcing use of the definition type", umd.force_type)
      umd.requirejs = umd.define = umd.factory = umd[umd.force_type]
    }

  var define = umd.define || function() {
    // Global define is the amdefine Object if it was available (otherwise it will be undefined). If amdefine is not available than check for
    // the module.exprts Object and use commonjs. When all else fails, use the native global Object.

    if ( umd.module && !umd.define )
      try { umd.define = umd.module.require("amdefine")(umd.module) }
      catch(e) { console.log(e.message) }

    var use_type = (umd.define || umd.factory)
    use_type.apply(use_type.prototype, arguments)

  }

  var requirejs = umd.requirejs || umd.rjs

  // --- Module definitions are added here

  define("aa", ["bb"], function() {
    console.log("Init aa")
    return {
      id: "aa"
    }
  })

  define("bb", [], function() {
    console.log("Init bb")
    return {
      id: "aa"
    }
  })


  requirejs.config({})
  requirejs(["require"], function(require) {

      console.log("Init main", __filename)
  //    var aa = require("./cc")
      return {
          aa: 'require("aa")',
          bb: 'require("bb")'
      }
  })


define(function(require) {

    console.log("Init main", __filename)
//    var aa = require("./cc")
    return {
        aa: require("aa"),
        bb: require("bb")
    }
})
  // -----------

// force_type is the only option thus far and can be set to the global Object (first parameter), or the second parameter as an Object.
})(this)
