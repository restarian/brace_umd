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

 Author: Robert Edward Steckroth, Bustout, <RobertSteckroth@gmail.com> */

// Global property namespace will be used inside this function so it is necessary to pass any globally defined properties into the function
// because of how variable hosting works. Otherwise, the namespace would be immediately overwritten if it wasn't predefined as argument data.
!function(_factory, _define, _requirejs, option) {

// This is the unified module definition script. It wraps the other module definitions and applies the appropriate mechanism to it. The parameters
// are named the same as the providing namespace of the definition with a underscore prepended to avoid hoisting overwrite.  The first parameter 
// passed in is the global Object to use as the factory if all the other types are not available. The _define property should be passed the amdefine 
// module or undefined. The _requirejs argument should be the requirejs Object or undefined. The last argument is the options Object. This data 
// controls behaviors of the script (available options can be studied in the documentation). Other definition types can be added by copying the 
// template from the others and supplying the correlating data.

	var define, requirejs, require, umd = {

		// This will store the last id used in define calls (not forcing factory), so that an anonymous module can be created from the entry point.
		commonjs_available: typeof module == "object" && "filename" in module && "exports" in module,
		// The main point of providing requirejs support is from any options to requirejs which may need to be set withing other modules. Generally 
		// the requirejs constructor function will not be called from within optimized bundles but it is available if needed. 
		requirejs: _requirejs,
		define: _define,
		// option data is generally set with require("brace_umd").wrap_end_option({})
		data: typeof option == "object" && option || {},
		// The support simply lists the available definition types (only the qualifier is used), in the script which can change by adding a few pieces of data.
		set_global: function() {

			// Set the global data used in with amd definitions.
			var support = {
				// auto_anonymous relies on define_proxy do it must be used if that option is set.
				define: !this.data.auto_anonymous && this.define || this.define_proxy,
				requirejs: this.requirejs || this.requirejs_proxy,
				require: this.requirejs || this.commonjs_available && module.require || this.factory,
				factory: this.factory,
			}

			if ( this.data.force_type in support )
					support.requirejs = support.require = support.define = support.factory = support[this.data.force_type]

			define = support.define
			requirejs = support.requirejs
			require = support.require
		},
		_last_define_id: false, 
		factory: function(id, dependency, callback, error_callback) {
			// The _factory argument is the default definition type and thusly is expected to exist. This method will add the module to the native 
			// global object (or whatever the first parameter is) or to the module.exports if this is ran in a commonjs environment. All module dependencies 
			// need to be already added to the object before the module is called (which requirejs does nicely). The module  will fail to load with a 
			// message if any dependencies are unavailable. It is then up to the developer to re-order the modules so they load in the correct order.

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
				dependency = ["require"]
				id = ""
			}
	
			var factory_dep = [], 
				available_require = umd.commonjs_available && module.require || _factory.require,
				unmet = "" 

			// Gather the objects listed as dependencies from the factory object and store them in a temporary array. These will be passed to the new factory
			// object as parameters but will not be deleted sense the parameters will hold individual links to the modules.
			dependency.every(function(value) { 
				value = value.replace(/^\.[\/,\\]/, "")
				factory_dep.push( value === "require" && available_require || _factory[value] )

				if ( value !== "require" && !(value in _factory) )
					unmet = value

				return !unmet
			 }) 

			if ( umd._last_define_id !== true ) {
				if ( id ) 
					umd._last_define_id = id
				// A anonymous module will not be created if one already exists so it will be set to true which halts the process.
				else {

					// This halts the process as the _last_define_id is expected to be used or not before this occurs.
					umd._last_define_id = true

					if ( !unmet ) {

						if ( umd.commonjs_available ) 
							module.exports = callback.apply(callback.prototype, factory_dep)
						else
							callback.apply(callback.prototype, factory_dep)
					} 
					else
						console.log("The amd factory attempted to load the", id||"anonymous", "module that specified a dependency which was not defined:", unmet)

					return
				}
			}

			// The property is added to the factory object if the module was not anonymous. It is necessary to use module.exports directly as creating 
			// links to it does not have the same effect.
			if ( umd.commonjs_available ) 
				module.exports[id] = callback.apply(callback.prototype, factory_dep)
			else
				_factory[id] = callback.apply(callback.prototype, factory_dep)
			
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
			  } catch(error) { }

			// Use the module or use the factory (unless force type is set).
			var use_type = umd.define || umd.factory
		
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
				} catch(error) { }

			umd.requirejs_proxy = umd.requirejs || umd.factory
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
					return umd.define[key]
					// This catch happens when an amdefine property is used but the amdefine module is not available. The script will function correctly 
					// but whatever was used will not have the intended affect. E.g. The define.require will return undefined instead.
				} catch(e) { }
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
					umd.requirejs_proxy = umd.requirejs
					// Re-setting the global variable data is necessary when re-assigning umd object data.
					umd.set_global()
					return umd.requirejs[key]
				} catch(e) { 
					return 
				}
			}).bind(null, umd.requirejs_proxy_key[o]))
		}
	}

	umd.set_global()	
	// ---- Module definitions are added here. ---------------------------------------------------------------

umd._last_define_id.length && define([umd._last_define_id], function(mod) { return mod }) 
	// Code below here is put into the wrap_end fragment. -------------------------------------------------------
// If _last_define_id is a string (which has a ength), than an anonymous module needs to be made.
	
// These need to be passed into the function so that the namespace can be used again without re-setting the values (see how variable hosting works in 
// javascript for more information).
}(this, typeof define === "function" && define || undefined, typeof requirejs === "function" && requirejs || undefined, {})
