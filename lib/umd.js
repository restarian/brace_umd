/* MIT License
Copyright (c) 2018 Robert Steckroth <RobertSteckroth@gmail.com>

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

 Author: Robert Edward Steckroth II, Bustout, <RobertSteckroth@gmail.com> */

// Global property namespace will be used inside this function so it is necessary to pass any globally defined properties into the function
// because of how variable hosting works. The namespace would be immediately overwritten if it wasn't predefined as argument data.
//module.require("bracket_print")
!function(_factory, _define, _requirejs, option) {

// This is the unified module definition script. It wraps the other module definition syntax and applies the appropriate mechanism to it. The parameters
// are named the same as the providing namespace of the definition with a underbar prepended to avoid hoisting overwrite.
// The first parameter passed in is the global Object to use as the factory if all the other types are not available.
// The _define property should be passed the amdefine module or undefined. The _requirejs argument should be the requirejs Object or undefined. The 
// last argument is the options Object. This data controls behaviors of the script (available options can be studied in the documentation).
// Other definition types can be added by copying the template from the others and supplying the correlating data.

	var define, requirejs, require, umd = {

		// This will store the last id used in define calls (not forcing factory), so that an anonymous module can be created from the entry point.
		commonjs_available: typeof module == "object" && "filename" in module && "exports" in module,
		log: function() {
		// If the bracket_print module is not loaded into the commonjs cache than the console.log function will be used.

			var found = false
			if ( umd.commonjs_available ) 
				try {
					umd.log = module.require("bracket_print")("Brace_umd", umd.data.print).s().log
					found = true
				} catch(error) { }
			 

			// It is necessary to check for console.log function availability sense the uglify-js parser will strip it out if the console-drop option is
			// set. Brace umd still functions without any logging ability.
			if ( !found && !(umd.log = console.log.bind(console)) ) 
				umd.log = function(){}

			return umd.log.apply(umd.log.prototype, arguments)
		},
		_last_define_id: false, factory: function(id, dependency, callback, error_callback) {
			// _factory is the default definition type and thusly is expected to exist.
			// This method will add the module to the native global Object (or whatever the first parameter is) or module.exports if in a commonjs environment.
			// The dependencies will have to be already added to the Object before this module is called (which requirejs does nicely). The module 
			// will fail to load with a message if any dependencies are unavailable. It is then up to the developer to re-order the modules so they load 
			// in the correct order. A string id is required to define the module if the platform is a browser.

			// These checks shift the arguments sense an id string and dependency array are not mandatory.
			if ( id && id.constructor === Array ) {
				// Here the dependencies and callbacks were only specified.
				error_callback = callback
				callback = dependency
				dependency = id
				id = ""
			}
			else if ( typeof id !== "string" ) {
				// ..and only if a function was passed in.
				error_callback = dependency
				callback = id
				dependency = []
				id = ""
			}
	
			// callback = typeof callback = function && callback || function(){}
			// A module definition is created with an empty id and one dependency if the auto_anonymous option is used. The primary module (which is passed
			// in as the only dependency of the newly created module), is identified as the last module found in the definition sequences. Note: using the 
			// requirejs optimizer ensures that this happens.

			var factory = this.commonjs_available && module.exports || _factory, factory_array = [], remove_path = /^\.[\/,\\]/, was_anony_ma_fied = false

			if ( this._last_define_id !== true ) {
				if ( id ) 
					this._last_define_id = id
				// A anonymous module will not be created if one already exists so it will be set to true which halts the process.
				else {

					// This halts the process as the _last_define_id is expected to be used or not before this occurs.
					this._last_define_id = true

					// This can be a thing in browsers as long as the native object is passed in empty
					if ( !this.commonjs_available ) //|| !Object.keys(factory).length !== this._total_modules ) 
						return !!umd.log("The factory definition is being used outside of a commonjs envrionment and the module does not supply an" +
													" id parameter. Skipping loading of the module. Note: the last module loaded was", this._last_define_id)
					else {
						// Gather the objects listed as dependencies from the factory and store them in a temporary array. These will be passed to the new factory
						// object as parameters but will not be delete sense the parameters will hold individual links to the modules. Note: the modules passed in 
						// as dependencies will be garbage once the function scope is lost which may not be desirable from a program execution design standpoint.

						if ( !dependency.every( function(value) {

							value = value.replace(remove_path, "")
							if ( value === "require" || !(value in factory) )  
								// returns false
								return !!umd.log("The dependency", value, "is not loaded into the factory. Skipping loading of the anonymous module")
							else 
								return true
						}) ) 
							return null 

						was_anony_ma_fied = true
						factory_array = dependency.map(function(value, index) {
							return this[value.replace(remove_path, "")]
						}, factory)

						// The factory now contains the anonymous module with the dependencies stored in link limbo via the arguments object.
						if ( this.commonjs_available )
							module.exports = callback.apply(callback.prototype, factory_array)
						else
							_factory = callback.apply(callback.prototype, factory_array)
					}
				}
			}

			if ( !was_anony_ma_fied && dependency.every( function(value) {

					// Remove the ./ at the front of the dependency id. This can be done sense it is superfluous in AMD module syntax but the requirejs
					// optimizer will add it to the build file define structure it generates.
					value = value.replace(remove_path, "")

					if ( value === "require" )
						return true
					else if ( ! (value in factory) )  
						// returns false
						return !!umd.log("The dependency", value, "is not loaded into the factory. Skipping loading of the module", id)
					else 
						return true
				}) 
			) {
				// Use the module exporter if the environment has one or simply use the global instance passed in the umd.
				factory[id] = callback.apply(callback.prototype, dependency.map(function(value, index) { 
						return this[value.replace(remove_path, "")] 
					}, factory))
			}

		},
		// The main point of providing requirejs support is from any options to requirejs which may need to be set withing other modules. Generally 
		// the requirejs constructor function will not be called from within optimized bundles but it is available if needed. 
		requirejs: _requirejs,
		define: _define,
		// option data is generally set with require("brace_umd").wrap_end_option({})
		data: typeof option == "object" && option || {},
		// The support simply lists the available definition types (only the qualifier is used), in the script which can change by adding a few pieces of data.
		set_global: function() {

			// Set the global data used in with amd definitions and a few extras common to javascript.
			var support = {
				// auto_anonymous relies on define_proxy do it must be used if that option is set.
				define: !this.data.auto_anonymous && this.define || this.define_proxy,
				requirejs: this.requirejs || this.requirejs_proxy,
				require: this.requirejs || this.commonjs_available && module.require || this.factory.bind(this),
				factory: this.factory.bind(this),
			}

			var force_type = this.data.force_type && this.data.force_type.toString() || ""
			if ( force_type )
				if ( !force_type in support )
					umd.log("The forced type", force_type, "specified as an option is not supported by Brace UMD. Supported types are", Object.keys(support))
				else {
					// Set all of the define types to the forced type so that it is only ever called.
					umd.log("Forcing use of the definition type", force_type)
					support.requirejs = support.require = support.define = support.factory = support[force_type]
				}

			define = support.define
			requirejs = support.requirejs
			require = support.require
		},
		// It is not an issue if extra keys are put here that are not defined in the current version of requirejs or amdefine. If any older versions 
		// of the definition scripts contain different property namespace, than they can be included in the Array as well. The purpose of these it to 
		// load the modules if they are passed into the main enclosure as undefined.
		requirejs_proxy_key: ["config", "nextTick", "version", "jsExtRegExp", "isBrowser", "s", "toUrl", "undef", "defined", "specified", "onError",
									 "createNode", "load", "exec"],
		define_proxy_key: ["amd", "require"],
		define_proxy: function() {
			// This member will load the module using the requested definition type if it does not exist yet. If the definition type is not found in the 
			// environment than the factory will be used (the factory is the default definition type).

			if ( umd.commonjs_available && !umd.define )
			  try {
				 umd.define = module.require("amdefine")(module)
				 for ( var p in umd.define )
					umd.define_proxy[p] = umd.define[p]
			  } catch(e) { umd.log("Brace UMD is unable to find the amdefine module.", e.message) }

			// Use the module or use the factory (unless force type is set).
			var use_type = umd.define || umd.factory.bind(this)
			// This can be verbose logging
			if ( use_type == umd.define ) umd.log("Using proxied amdefine definition.")
			else umd.log("Using factory proxied from amdefine call.")
			
			// Turn the proxy function back into the original one. This function will never be called again sense it is overwritten here. This can only
			// happen if auto_anonymous is not set sense that relies on the proxy to function.
			if ( use_type != umd.define || !umd.data.auto_anonymous ) {
				umd.define_proxy = use_type
				// Resetting the global variable data is necessary when re-assigning umd object data.
				umd.set_global()
			}
			// An amd definition will have at least two arguments if it has an id.
			else if ( umd._last_define_id !== true && typeof arguments[0] === "string" ) 
				umd._last_define_id = arguments[0]
			// A anonymous module will not be created if one already exists so it will be set to true which halts the process.
			else if ( typeof arguments[0] !== "string" ) 
				umd._last_define_id = true

			use_type.apply(use_type.prototype, arguments)

		 },
		 requirejs_proxy: function() {

			if ( umd.commonjs_available )
				try {
					umd.requirejs = module.require("requirejs")
				} catch(e) { umd.log("Brace UMD is unable to find the requirejs module.", e.message) }

			umd.log("Using proxied requirejs method.")
			umd.requirejs_proxy = umd.requirejs || umd.factory.bind(umd)
			// Re-setting the global variable data is necessary when re-assigning umd object data.
			umd.set_global()
			umd.requirejs_proxy.apply(umd.requirejs_proxy.prototype, arguments)
		},
	}


	// These two loops will set the properties of the wrapping functions of requirejs and define above to load the module if it does not exist and than 
	// return the request property.
	for ( var o in umd.define_proxy_key )
		umd.define_proxy.__defineGetter__(umd.define_proxy_key[o], (function(key) {
			if ( umd.commonjs_available && !umd.define )
				try {
					umd.define = module.require("amdefine")(module)
					// This will actually set the property of this property which is a getter. The new property will be the module property. The updated property 
					// value is available immediately and this function will be garbage collected by the ecma engine as soon as it returns (this can only happen 
					// if the property is set via a function).
					for ( var p in umd.define ) {
						// The getter must first be deleted before a standard property is set to this Object or the property will not be overwritten.
						delete this[p]
						this[p] = umd.define[p]
					}
					umd.log("Using proxied amdefine method.")
					return umd.define[key]
					// This catch happens when an amdefine property is used but the amdefine module is not available. The script will function correctly 
					// but whatever was used will not have the intended affect. E.g. The define.require will return undefined instead.
				} catch(e) { 
					// console.log returns undefined which is what is desired
					return umd.log("Brace UMD is unable to find the amdefine module.", e.message) 
				}
		// Return the Object property of the definition type. This is the last time this function can be accessed because the property is re-set above.
		// The bind is needed to store the key value from the loop (ECMA 6 fixes this with the let keyword but this script is designed for browsers as well).
		// Bind can be passed a null prototype here because the getter will either call the function with the prototype or the function is re-made with
		// new Function() call and placed into the prototype chain of the Object.
		}).bind(null, umd.define_proxy_key[o]))
	
	// The requirejs constructor is also provided for convenience.
	// ----- This is the same design as above so comments are omitted.
	if ( !requirejs ) {
		for ( var o in umd.requirejs_proxy_key ) {
			umd.requirejs_proxy.__defineGetter__(umd.requirejs_proxy_key[o], (function(key) {
			if ( umd.commonjs_available )
				try {
					umd.requirejs = module.require("requirejs")
					umd.log("Using proxied requirejs method to access requirejs." + key)
					umd.requirejs_proxy = umd.requirejs
					// Resetting the global variable data is necessary when re-assigning umd object data.
					umd.set_global()
					return umd.requirejs[key]
				} catch(e) { 
					return umd.log("Brace UMD is unable to find the requirejs module.", e.message)
				}
			}).bind(null, umd.requirejs_proxy_key[o]))
		}
	}

	umd.set_global()	
	// ---- Module definitions are added here. ---------------------------------------------------------------

// Code below here is put into the wrap_end fragment. -------------------------------------------------------
// If _last_define_id is a string (which has a length), than an anonymous module needs to be made.
umd._last_define_id.length && define([umd._last_define_id], function(mod) { return mod }) 
// These need to be passed into the function so that the namespace can be used again without re-setting the values (see how variable hosting works in 
// javascript for more information).
}(this, typeof define === "function" && define || undefined, typeof requirejs === "function" && requirejs || undefined, {})
