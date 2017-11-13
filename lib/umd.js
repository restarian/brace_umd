/*
MIT License
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
// because of how variable hosting works. The namespace would be immediately overwritten if it wasn't pre-defined as argument data.
!function(_factory, _define, _requirejs, option) {

// This is the unified module definition script. It wraps the other module definition syntax and applies the appropriate mechanism to it. The parameters
// are named the same as the providing namespace of the definition with a underbar prepended to avoid hoisting overwrite.
// The first parameter passed in is the global Object to use as the factory if all the other types are not available.
// The _define property should be passed the amdefine module or undefined. The _requirejs argument should be the requirejs Object or undefined. The 
// last argument is the options Object. This data controls behaviors of the script (available options can be studied in the documentation).
// Other definition types can be added by copying the template from the others and supplying the correlating data.

	var __filename, __dirname, define, requirejs, require, umd = {

		// This will store the last id used in define calls (not forcing factory), so that an anonymous module can be created from the entry point.
		commonjs_available: typeof module == "object",
		_last_define_id: false,
		filename: "",
		// _factory is the default definition type and thusly is expected to exist.
		factory: function(id, dependency, callback, error_callback) {
			// This method will add the module to the native global Object (or whatever the first parameter is). The dependencies will have to be already 
			// added to the Object before this module is called. The module will fail to load with a message if ANY dependencies are unavailable. It is then 
			// up to the developer to re-order the modules so they load in the correct order. A string id is required to define the module if the platform 
			// is a browser.
			if ( id && id.constructor === Array && this.commonjs_available) {
				// Shift the arguments over sense the id string is not always required.
				error_callback = callback
				callback = dependency
				dependency = id
				//	An id should be available if the environment was commonjs.
				id = this.filename
			}
		
			// The factory mandates that the amd call used an id parameter or that one is available otherwise.			
			if ( typeof id !== "string" ) 
				console.log("The factory Object is being used but the module does not supply an id parameter. Skipping loading of the module.")
			else if ( dependency.every(
				function(value) {
				  // Remove the ./ at the front of the dependency id. This can be done sense it is superfluous in AMD module syntax but the requirejs
				  // optimizer will add it to the build file define structure it generates.
					if ( value === "require" )
						  return true
					value = value.replace(/^\.[\/,\\]/, "")
					if ( (this.data.force_type === "factory" && !(value in _factory)) || (this.commonjs_available && !(value in module.exports)) 
								|| !(value in _factory) )  
						return !!console.log("The dependency", value, "is not loaded into the factory. Skipping loading of the module", id)

					return true
					  
				}, this) 
			) {
				// Use the module exporter if the environment has one or simply use the global instance passed in the umd.
				if ( this.commonjs_available ) 
					module.exports[id] = callback.apply(callback.prototype, dependency.map(function(value, index) { return this[value.replace(/^\.[\/,\\]/, "")] }, module.exports))
				else
					_factory[id] = callback.apply(callback.prototype, dependency.map(function(value, index) { return this[value.replace(/^\.[\/,\\]/, "")] }, _factory))
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
				define: !this.data.auto_anonymous && this.define || this.define_proxy.bind(this),
				requirejs: this.requirejs || this.requirejs_proxy.bind(this),
				require: this.requirejs || this.commonjs_available && module.require || this.factory.bind(this),
				factory: this.factory.bind(this),
			}

			var force_type = this.data.force_type && this.data.force_type.toString() || ""
			if ( force_type )
				if ( !force_type in support )
					console.log("The forced type", force_type, "specified as an option is not supported by Brace UMD. Supported types are", Object.keys(support))
				else {
					// Set all of the define types to the forced type so that it is only ever called.
					console.log("Forcing use of the definition type", force_type)
					support.requirejs = support.require = support.define = support.factory = support[force_type]
				}

			define = support.define
			requirejs = support.requirejs
			require = support.require
		},
		get define_proxy() {
			// This member will load the module using the requested definition type if it does not exist yet. If the definition type is not found in the 
			// environment than the factory will be used (the factory is the default definition type).

			if ( this.commonjs_available && !this.define )
			  try {
				 this.define = module.require("amdefine")(module)
			  } catch(e) { console.log("Unable to find amdefine module.", e.message) }

			// Use the module or use the factory (unless force type is set).
			var use_type = this.define || this.factory.bind(this)
			// This can be verbose logging
			if ( use_type == this.define ) console.log("Using proxied amdefine definition.")
			else console.log("Using factory proxied from amdefine call.")
			
			// Turn the proxy function back into the original one. This function will never be called again sense it is overwritten here. This can only
			// happen if auto_anonymous is not set sense that relies on the proxy to function.
			if ( use_type != this.define || !this.data.auto_anonymous ) {
				Object.defineProperty(this, "define_proxy", {
					writable: true, configurable: true, enumerable: true, value: use_type
				})
				// Resetting the global variable data is necessary when reassigning proxy data.
				this.set_global()
				return use_type
			}

			else return (function() {

				if ( this._last_define_id !== true && arguments.length > 2 ) 
					this._last_define_id = arguments[0]
				// A anonymous module will not be created if one already exists so it will be set to true which halts the process.
				else if ( arguments.length <= 2 ) 
					this._last_define_id = true

				return use_type.apply(use_type.prototype, arguments)

			}).bind(this)
			
		 },
		 get requirejs_proxy() {

			if ( this.commonjs_available && !this.requirejs )
			  try {
				 this.requirejs = module.require("requirejs")
			  } catch(e) { console.log("Brace UMD is unable to find requirejs module.", e.message) }

			var use_type = this.requirejs || this.factory.bind(this)
			if ( use_type == this.requirejs ) console.log("Using proxied requirejs definition.")
			else console.log("Using factory proxied from requirejs call.")

			if ( use_type != this.requirejs ) {
				Object.defineProperty(this, "requirejs_proxy", {
					writable: true, configurable: true, enumerable: true, value: use_type
				})
				// Resetting the global variable data is necessary when reassigning proxy data.
				this.set_global()
			}
			
			return use_type
		},
	}

	__filename = umd.commonjs_available && module.filename || "" 
	__dirname = umd.commonjs_available && module.require("path").dirname(__filename) || ""
	umd.set_global()	
	// The file name using commonjs path module. Otherwise, the factory will require an id to work in non-nodejs environments.
	if ( umd.commonjs_available )
		umd.filename = module.require("path").basename(__filename)

	// ---- Module definitions are added here.
	// ----------------------

// Code below here is put into the wrap_end fragment. -------------------------------------------------------
// If _last_define_id is a string (which has a length), than an anonymous module needs to be made.
umd._last_define_id.length && define([umd._last_define_id], function(mod) { return mod }) 
// These need to be passed into the function so that the namespace can be used again without re-setting the values (see how variable hosting works in 
// javascript for more information).
}(this, typeof define === "function" && define || undefined, typeof requirejs === "function" && requirejs || undefined, {})
