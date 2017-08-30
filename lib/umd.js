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
// because of how variable hosting works. The namespace would be immediately overwritten if it wasn't pre-defined as arguments.
!function(_factory, _module, _define, _requirejs, option) {
// This is the unified module definition script. It wraps the other module definition syntax and applies the appropriate mechanism to it. The parameters
// are named the same as the providing namespace of the definition with a underbar prepended to avoid hoisting overwrite.
// The first parameter passed in is the global Object to use as the factory if all the other types are not available.
// The second argument supplies the module Object used in nodejs which should be undefined in non-nodejs environments. The _define property should 
// be passed the amdefine module or undefined. The _requirejs argument should be the requirejs Object or undefined. The last argument is the options 
// Object. This data controls behaviors of the script (available options can be read about in the documentation).

	var __filename, __dirname, require, define, requirejs, umd = {

		// The factory is the default definition type and thusly is expected to exist.
		module: _module,
		_factory: _factory,
		requirejs: _requirejs,
		define: _define,
		// these are re-set because of how mocha.js and requirejs work internally. It is a bug that the unit tests would need this work around. The
		// __filename and __dirname arguments should be mocked in the unit tests instead of the conditional statements below (which are only used
		// when the unit tests are ran).
		__filename: __filename || _module && _module.exports && _module.filename || undefined,
		__dirname: __dirname || _module && _module.exports && _module.require("path").dirname(_module.filename) || undefined,
		data: option,
		// The support simply lists the available definition types (only the qualifier is used), in the script which can change by adding a few pieces of data.
		support: {"requirejs": true, "define": true, "require": true, "factory": true},
		// Force this type to be used as the defining method.
		// It is not an issue if extra keys are put here that are not defined in the current version of requirejs or amdefine. If any older versions 
		// of the definition scripts contain different property namespace, than they can be included in the Array as well. The purpose of these it to 
		// load the modules if they are passed into the main enclosure as undefined.
		requirejs_proxy_key: ["config", "nextTick", "version", "jsExtRegExp", "isBrowser", "s", "toUrl", "undef", "defined", "specified", "onError",
									 "createNode", "load", "exec"],
		define_proxy_key: ["amd", "require"],
		define_proxy: function() {
			// This member will load the module using the requested definition type if it does not exist yet. If the definition type is not found in the 
			// environment than the factory will be used (the factory is the default definition type).

			if ( umd.module && !umd.define )
			  try {
				 umd.define = umd.module.require("amdefine")(umd.module)
				 for ( var p in umd.define )
					umd.define_proxy[p] = umd.define[p]
			  } catch(e) { console.log("Unable to find amdefine module.", e.message) }

			var use_type = (umd.define || umd.factory)
			if ( use_type == umd.define )
				console.log("Using proxied amdefine definition.")
			else
				console.log("Using factory proxied from amdefine call.")
			// Use the module or use the factory (unless force type is set).
			use_type.apply(use_type.prototype, arguments)
		 },
		 requirejs_proxy: function() {

			if ( umd.module && !umd.requirejs )
			  try {
				 umd.requirejs = umd.module.require("requirejs")
				 for ( var p in umd.requirejs )
					umd.requirejs_proxy[p] = umd.requirejs[p]
			  } catch(e) { console.log("Unable to find requirejs module.", e.message) }

			console.log("Using proxied requirejs method.")
			var use_type = (umd.requirejs || umd.factory)
			use_type.apply(use_type.prototype, arguments)
		},
	}

	umd.factory = umd._factory && (function(id, dependancy, callback, error_callback) {
		// This method will add the module to the native global Object (or whatever the first parameter is). The dependencies will have to be already 
		// added to the Object before this module is called. The module will fail to load with a message if ANY dependencies are unavailable. It is then 
		// up to the developer to re-order the modules so they load in the correct order. A string id is required to define the module if the platform 
		// is a browser.

		if ( id && id.constructor === Array && this.module ) {
			// Shift the arguments over sense the id string is not always required.

			var i = id, d = dependency, cb = callback, err_cb = error_callback
			error_callback = err_cb
			callback = cb
			dependency = i
			id = __filename || ""
		}

		if ( typeof id !== "string" ) 
			console.log("The factory Object is being used but the module does not supply an id parameter. Skipping loading of the module.")
		else if ( dependancy.every(
			function(value) {
			  return value in this._factory || !!console.log("The dependency", value, "is not loaded into the factory. Skipping loading of the module", id)
			}, this) 
		)
		this._factory[id] = callback.apply(callback.prototype, dependancy.map(function(value, index) { return this._factory[value] }, this))

	}).bind(umd)

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
					console.log("Using proxied amdefine method.")
					return umd.define[key]
					// This catch happens when an amdefine property is used but the amdefine module is not available. The script will function correctly 
					// but whatever was used will not have the intended affect. E.g. The define.require will return undefined instead.
				} catch(e) { 
					// console.log returns undefined which is what is desired
					return console.log("Unable to find amdefine module.", e.message)
				}
		// Return the Object property of the definition type. This is the last time this function can be accessed because the property is re-set above.
		// The bind is needed to store the key value from the loop (ECMA 6 fixes this with the let keyword but this script is designed for browsers as well).
		// Bind can be passed a null prototype here because the getter will either call the function with the prototype or the function is re-made with
		// new Function() call and placed into the prototype chain of the Object.
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
			console.log("Using proxied requirejs method.")
			return umd.requirejs[p]
		  } catch(e) { 
			return console.log("Unable to find requirejs module.", e.message)
		  }
	}).bind(null, umd.requirejs_proxy_key[o]))

	if ( umd.data.force_type )
		if ( !(umd.data.force_type in umd.support) ) {
			console.log("The forced type", umd.data.force_type, "specified as an option is not supported by Brace UMD. Supported types are", 
							Object.keys(umd.support))
		} else if ( !umd[umd.data.force_type] ) {
			console.log("The forced type", umd.data.force_type, "is not available.")
		} else {
			// Set all of the define types to the forced type so that it is only ever called.
			console.log("Forcing use of the definition type", umd.data.force_type)
			umd.requirejs = umd.require = umd.define = umd.factory = umd[umd.data.force_type]
		}

	__dirname = __dirname || umd.__dirname
	__filename = __filename || umd.__filename

	define = umd.define || umd.define_proxy
	requirejs = umd.requirejs || umd.requirejs_proxy
	// The global require property should equal the requirejs property in dom environments. In node, requirejs should not be equal to require.
	require = umd.module && umd.module.require || requirejs

	// --- Module definitions are added here
	// ----------------------

	// These need to be passed into the function so that the namespace can be used again without re-setting the values (see how variable hosting works in 
	// javascript for more information).
// All of these must be passed in as the definition or undefined.
}(this, typeof module === "object" && module || undefined, typeof define === "function" && define || undefined, typeof requirejs === "function" && requirejs || undefined, {})
