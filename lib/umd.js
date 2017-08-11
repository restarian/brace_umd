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

// Global property namespace will be used inside this function so it is necessary to pass any globally defined properties into the function
// because of how variable hosting works.
!function UMD(fac, def, reqjs) {
// This is the unified module definition script. It wraps all other module definition syntax and applies the appropriate mechanism to it. The 
// three parameters passed in are: 1. The native global Object to use as the factory if all the others are not available which can be any Object. 
// 2. The def property should contain amdefine global of undefined. 3. The reqjs should contain requirejs object or undefined. If a force_type
// property is set to any of the arguments than it will be forced as used. The force type from the first argument starting left to right will be
// used.

  var require, define, requirejs, umd = {

    requirejs: reqjs,
    define: def,
    module: module,
    _factory: fac,
    support: {"requirejs": true, "define": true, "require": true, "factory": true},
	// Force this type to be used as the defining method.
    force_type: fac && fac.force_type || def && def.force_type || reqjs && reqjs.force_type || undefined,
	// It is not a big deal if extra keys are put here that are not defined in the current version of requirejs or amdefine. It any older versions 
	// than the latest version have other properties than they can be included here too. The purpose of these it to load the modules if they are not 
	// available (only in commonjs environments for now).
    requirejs_proxy_key: ["config", "nextTick", "version", "jsExtRegExp", "isBrowser", "s", "toUrl", "undef", "defined", "specified", "onError", "createNode", "load", "exec"],
    define_proxy_key: ["amd", "require"],
    define_proxy: function() {
      // This will load the module if it does not exist yet if umd.module is defined (in nodejs environments).
      if ( umd.module && !umd.define )
        try {
          umd.define = umd.module.require("amdefine")(umd.module)
          for ( var p in umd.define )
            umd.define_proxy[p] = umd.define[p]
        } catch(e) { console.log(e.message) }

      // Use the module or use the factory (unless force type is set).
      console.log("Using proxied amdefine method. Avoid this by defining a global requirejs property prior to initializing this script.")
      var use_type = (umd.define || umd.factory)
      use_type.apply(use_type.prototype, arguments)
    },
    requirejs_proxy: function() {

      if ( umd.module && !umd.requirejs )
        try {
          umd.requirejs = umd.module.require("requirejs")
          for ( var p in umd.requirejs )
            umd.requirejs_proxy[p] = umd.requirejs[p]
        } catch(e) { console.log(e.message) }

      console.log("Using proxied requirejs method. Avoid this by defining a global define property prior to initializing this script.")
      var use_type = (umd.requirejs || umd.factory)
      use_type.apply(use_type.prototype, arguments)
    },
  }

	// These two loops will set the properties of the wrapping functions of requirejs and define above to load the module if it does not exist and than 
	// return the request property.
  for ( var o in umd.define_proxy_key )
    umd.define_proxy.__defineGetter__(umd.define_proxy_key[o], (function(key) {
    if ( umd.module && !umd.define )
      try {
        umd.define = umd.module.require("amdefine")(umd.module)
        // This will actually set the property of this property which is a getter. The new property will be the module property. The updated property 
		// value is available immediately and this function will be garbage collected by the ecma engine as soon as it returns (this can only happen 
		// if the property is set via a function).
        for ( var p in umd.define ) {
	  // The getter must first be deleted before a standard property is set to this Object or the property will not be overwritten.
	  delete this[p]
	  this[p] = umd.define[p]
	}
	console.log("Using proxied amdefine method. Avoid this by defining a global define property prior to initializing this script.")
	// This catch happens when an amdefine property is used but the amdefine module is not available. The script will function correctly but whatever
	// was used will not have the intended affect. E.g. The define.require will return undefined instead.
      	return umd.define[key]
      } catch(e) { 
	console.log(e.message) 
	return undefined
      }
      // Return the property of the newly loaded module. This is the last time this function can be accessed because the property is re-set above.
      // The bind is needed to store the key value from the loop (ECMA 6 fixes this with the let keyword but this script should work in the browsers too).
    }).bind(null, umd.define_proxy_key[o]))

	// ----- This is the same design as above so comments are omitted.
	for ( var o in umd.requirejs_proxy_key )
		umd.requirejs_proxy.__defineGetter__(umd.requirejs_proxy_key[o], (function(key) {
		if ( umd.module && !umd.requirejs )
		  try {
			umd.requirejs = umd.module.require("requirejs")
			for ( var p in umd.requirejs ) {
		  delete this[p]
			  this[p] = umd.requirejs[p]
		}
		console.log("Using proxied requirejs method. Avoid this by defining a global requirejs property prior to initializing this script.")
		  } catch(e) { 
		console.log(e.message) 
		return undefined
		  }
		}).bind(null, umd.requirejs_proxy_key[o]))
	// ----- 

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

  define = umd.define || umd.define_proxy
  requirejs = umd.requirejs || umd.requirejs_proxy
  // require should equal requirejs in non-dom environments. In node it should be equal to require but in this script it is equal to 
  // module.require (which should be fine).
  require = umd.module && umd.module.require || requirejs

// --- Module definitions are added here
// ----------------------

// force_type is the only option thus far and can be set to the global Object (first parameter), or the second parameter as an Object.
}(this, typeof define == "function" && define || undefined, typeof requirejs == "function" && requirejs || undefined)
