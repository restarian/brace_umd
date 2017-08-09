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
    define: (typeof define === "function" && define) || undefined,
    module: module,
    _factory: arguments[0] || undefined,
    support: {"requirejs": true, "define": true, "require": true, "factory": true},
    force_type: (arguments[0] && arguments[0].force_type) || (arguments[1] && arguments[1].force_type),
    // It is not a big deal if extra keys are put here that are not defined in the current version of requirejs or amdefine. It any older versions than the latest version
    // have other properties than they can be included here too. The purpose of these it to load the modules if they are not available (only in commonjs environments for now).
    rjs_key: [ "config", "nextTick", "version", "jsExtRegExp", "isBrowser", "s", "toUrl", "undef", "defined", "specified", "onError", "createNode", "load", "exec" ],
    dfn_key: [ "amd", "require" ],
    dfn: function() {
      // This will load the module if it does not exist yet if umd.module is defined (in nodejs environments).
      if ( umd.module && !umd.define )
        try {
          umd.define = umd.module.require("amdefine")(umd.module)
          for ( var p in umd.define )
            this[p] = umd.define[p]
        } catch(e) { console.log(e.message) }

      // Use the module or use the factory (uless force type is set).
      var use_type = (umd.define || umd.factory)
      use_type.apply(use_type.prototype, arguments)
    },
    rjs: function() {

      if ( umd.module && !umd.requirejs )
        try {
          umd.requirejs = umd.module.require("requirejs")
          for ( var p in umd.requirejs )
            this[p] = umd.requirejs[p]
        } catch(e) { console.log(e.message) }

      var use_type = (umd.requirejs || umd.factory)
      use_type.apply(use_type.prototype, arguments)
    },
  }

  // These two loops will set the properties of the wrapping functions of requirejs and define above to load the module if it does not exist and than return the request property.
  for ( var o in umd.dfn_key )
    umd.dfn.__defineGetter__(umd.dfn_key[o], (function(key) {
    if ( umd.module )
      try {
        umd.define = umd.module.require("amdefine")(umd.module)
        // This will actually set the property of this property which is a getter. The new property will be the module poperty. The updated property value is available immediately
        // and this function will be garbage collected by the ecma engine as soon as it returns (this can only happen if the property is set via a function).
        for ( var p in umd.define ) {
	  // The getter must first be deleted before a standard property is set to this Object or the property will not be overwriten.
	  delete this[p]
          this[p] = umd.define[p]
	}
	// This catch happens when an amdefine property is used but the amdefine module is not available. The script will function correctly but whatever
	// was used will not have the inteded affect. E.g. The define.require will return undefined instead.
      	return umd.define[key]
      } catch(e) { 
	console.log(e.message) 
	return undefined
      }
      // Return the property of the newly loaded module. This is the last time this function can be accessed because the property is re-set above.
      // The bind is needed to store the key value from the loop (ECMA 6 fixes this with the let keyword but this script should work in the browsers too :()
    }).bind(null, umd.dfn_key[o]))

  // This is the same design as above so comments are omited.
  for ( var o in umd.rjs_key )
    umd.rjs.__defineGetter__(umd.rjs_key[o], (function(key) {
    if ( umd.module )
      try {
        umd.requirejs = umd.module.require("requirejs")
        for ( var p in umd.requirejs ) {
	  delete this[p]
          this[p] = umd.requirejs[p]
	}
      } catch(e) { 
	console.log(e.message) 
	return undefined
      }
    }).bind(null, umd.rjs_key[o]))

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

    if ( typeof id !== "string" ) console.log("The global native Object is attempted to be used but the module does not supply an id parameter. Skipping loading of the module.")
    else if ( dependancy.every(function(value, index) {
        return value in this._factory || !!console.log("The dependency", value, "is not loaded into the factory yet. Skipping loading of the module", id)
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
      umd.requirejs = umd.require = umd.define = umd.factory = umd[umd.force_type]
    }

  var define = umd.define || umd.dfn
  var requirejs = umd.requirejs || umd.rjs
  // require should equal requirejs in non-dom environments. In node it should be equal to require but in this script it is equal to module.require (which should be fine).
  var require = umd.module && umd.module.require || requirejs

// --- Module definitions are added here
// ----------------------

// force_type is the only option thus far and can be set to the global Object (first parameter), or the second parameter as an Object.
})
