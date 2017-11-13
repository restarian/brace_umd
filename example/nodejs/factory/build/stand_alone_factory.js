//Cool joes
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
                                                                                !(function(e, i, t, o) {
                                              // This is the unified module definition script. It wraps the other module definition syntax and applies the appropriate mechanism to it. The parameters
                                              // are named the same as the providing namespace of the definition with a underbar prepended to avoid hoisting overwrite.
                                              // The first parameter passed in is the global Object to use as the factory if all the other types are not available.
                                              // The _define property should be passed the amdefine module or undefined. The _requirejs argument should be the requirejs Object or undefined. The 
                                              // last argument is the options Object. This data controls behaviors of the script (available options can be studied in the documentation).
                                              // Other definition types can be added by copying the template from the others and supplying the correlating data.
                                              var __filename, __dirname, define, requirejs, require, umd = {
                                                    // This will store the last id used in define calls (not forcing factory), so that an anonymous module can be created from the entry point.
                                                    "e": "object" == typeof module,
                                                    "i": !1,
                                                    "filename": "",
                                                    // _factory is the default definition type and thusly is expected to exist.
                                                    "factory": function(i, t, o, s) {
                                                          // This method will add the module to the native global Object (or whatever the first parameter is). The dependencies will have to be already 
                                                          // added to the Object before this module is called. The module will fail to load with a message if ANY dependencies are unavailable. It is then 
                                                          // up to the developer to re-order the modules so they load in the correct order. A string id is required to define the module if the platform 
                                                          // is a browser.
                                                          i && i.constructor === Array && this.e && (// Shift the arguments over sense the id string is not always required.
                                                          s = o, o = t, t = i, //	An id should be available if the environment was commonjs.
                                                          i = this.filename), // The factory mandates that the amd call used an id parameter or that one is available otherwise.			
                                                          "string" != typeof i ? console.log("The factory Object is being used but the module does not supply an id parameter. Skipping loading of the module.") : t.every(function(t) {
                                                                // Remove the ./ at the front of the dependency id. This can be done sense it is superfluous in AMD module syntax but the requirejs
                                                                // optimizer will add it to the build file define structure it generates.
                                                                // Remove the ./ at the front of the dependency id. This can be done sense it is superfluous in AMD module syntax but the requirejs
                                                                // optimizer will add it to the build file define structure it generates.
                                                                return "require" === t || (t = t.replace(/^\.[\/,\\]/, ""), ("factory" !== this.t.force_type || t in e) && (!this.e || t in module.exports) && t in e || !!console.log("The dependency", t, "is not loaded into the factory. Skipping loading of the module", i));
                                                          }, this) && (// Use the module exporter if the environment has one or simply use the global instance passed in the umd.
                                                          this.e ? module.exports[i] = o.apply(o.prototype, t.map(function(e, i) {
                                                                return this[e.replace(/^\.[\/,\\]/, "")];
                                                          }, module.exports)) : e[i] = o.apply(o.prototype, t.map(function(e, i) {
                                                                return this[e.replace(/^\.[\/,\\]/, "")];
                                                          }, e)));
                                                    },
                                                    // The main point of providing requirejs support is from any options to requirejs which may need to be set withing other modules. Generally 
                                                    // the requirejs constructor function will not be called from within optimized bundles but it is available if needed. 
                                                    "requirejs": t,
                                                    "define": i,
                                                    // option data is generally set with require("brace_umd").wrap_end_option({})
                                                    "t": "object" == typeof o && o || {},
                                                    // The support simply lists the available definition types (only the qualifier is used), in the script which can change by adding a few pieces of data.
                                                    "o": function() {
                                                          // Set the global data used in with amd definitions and a few extras common to javascript.
                                                          var e = {
                                                                // auto_anonymous relies on define_proxy do it must be used if that option is set.
                                                                "define": !this.t.auto_anonymous && this.define || this.s.bind(this),
                                                                "requirejs": this.requirejs || this.n.bind(this),
                                                                "require": this.requirejs || this.e && module.require || this.factory.bind(this),
                                                                "factory": this.factory.bind(this)
                                                          }, i = this.t.force_type && this.t.force_type.toString() || "";
                                                          i && (!i in e ? console.log("The forced type", i, "specified as an option is not supported by Brace UMD. Supported types are", Object.keys(e)) : (// Set all of the define types to the forced type so that it is only ever called.
                                                          console.log("Forcing use of the definition type", i), e.requirejs = e.require = e.define = e.factory = e[i])), define = e.define, requirejs = e.requirejs, 
                                                          require = e.require;
                                                    },
                                                    get "s"() {
                                                          // This member will load the module using the requested definition type if it does not exist yet. If the definition type is not found in the 
                                                          // environment than the factory will be used (the factory is the default definition type).
                                                          if (this.e && !this.define) {
                                                                try {
                                                                      this.define = module.require("amdefine")(module);
                                                                } catch (i) {
                                                                      console.log("Unable to find amdefine module.", i.message);
                                                                }
                                                          }
                                                          // Use the module or use the factory (unless force type is set).
                                                          var e = this.define || this.factory.bind(this);
                                                          // Turn the proxy function back into the original one. This function will never be called again sense it is overwritten here. This can only
                                                          // happen if auto_anonymous is not set sense that relies on the proxy to function.
                                                          // This can be verbose logging
                                                          // Turn the proxy function back into the original one. This function will never be called again sense it is overwritten here. This can only
                                                          // happen if auto_anonymous is not set sense that relies on the proxy to function.
                                                          // Resetting the global variable data is necessary when reassigning proxy data.
                                                          return e == this.define ? console.log("Using proxied amdefine definition.") : console.log("Using factory proxied from amdefine call."), e == this.define && this.t.auto_anonymous ? function() {
                                                                return !0 !== this.i && arguments.length > 2 ? this.i = arguments[0] : arguments.length <= 2 && (this.i = !0), e.apply(e.prototype, arguments);
                                                          }.bind(this) : (Object.defineProperty(this, "define_proxy", {
                                                                "r": !0,
                                                                "h": !0,
                                                                "u": !0,
                                                                "d": e
                                                          }), this.o(), e);
                                                    },
                                                    get "n"() {
                                                          if (this.e && !this.requirejs) {
                                                                try {
                                                                      this.requirejs = module.require("requirejs");
                                                                } catch (i) {
                                                                      console.log("Brace UMD is unable to find requirejs module.", i.message);
                                                                }
                                                          }
                                                          var e = this.requirejs || this.factory.bind(this);
                                                          // Resetting the global variable data is necessary when reassigning proxy data.
                                                          return e == this.requirejs ? console.log("Using proxied requirejs definition.") : console.log("Using factory proxied from requirejs call."), 
                                                          e != this.requirejs && (Object.defineProperty(this, "requirejs_proxy", {
                                                                "r": !0,
                                                                "h": !0,
                                                                "u": !0,
                                                                "d": e
                                                          }), this.o()), e;
                                                    }
                                              };
                                              __filename = umd.e && module.filename || "", __dirname = umd.e && module.require("path").dirname(__filename) || "", umd.o(), // The file name using commonjs path module. Otherwise, the factory will require an id to work in non-nodejs environments.
                                              umd.e && (umd.filename = module.require("path").basename(__filename)), // ---- Module definitions are added here.
                                              // ----------------------
                                              // Code below here is put into the wrap_end fragment. -------------------------------------------------------
                                              // If _last_define_id is a string (which has a length), than an anonymous module needs to be made.;
define("first", [], function() {
	
	return {
		id: "first"
	}

})

define("second", [], function() {
	
	return {
		id: "second"
	}

})

define(["first", "nope", "second"], function(first, second) {

	return {
		first: first,
		second: second
	}
})
umd.i.length && define([ umd.i ], function(e) {
                                                    return e;
                                              });
                                        })(this, "function" == typeof define && define || void 0, "function" == typeof requirejs && requirejs || void 0,{"force_type":"factory"});