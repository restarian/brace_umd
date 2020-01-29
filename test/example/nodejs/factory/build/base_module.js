//Smeh
/* MIT License
Copyright (c) 2020 Robert Steckroth <RobertSteckroth@gmail.com>

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

  Brace Umd is a unified module definition script to use when defining javascript modules.

  this file is a part of Brace Umd

 Author: Robert Steckroth, [Bustout] <RobertSteckroth@gmail.com> */
   // Global property namespace will be used inside this function so it is necessary to pass any globally defined properties into the function
   // because of how variable hosting works. Otherwise, the namespace would be immediately overwritten if it wasn't predefined as argument data.
      !(
function(
u
,
 e
,
 i
,
 r) {

          // This is the unified module definition script. It wraps the other module definitions and applies the appropriate mechanism to it. The parameters
          // are named the same as the providing namespace of the definition with a underscore prepended to avoid hoisting overwrite.  The first parameter 
          // passed in is the global Object to use as the factory if all the other types are not available. The _define property should be passed the amdefine 
          // module or undefined. The _requirejs argument should be the requirejs Object or undefined. The last argument is the options Object. This data 
          // controls behaviors of the script (available options can be studied in the documentation). Other definition types can be added by copying the 
          // template from the others and supplying the correlating data.
          var define
,
 requirejs
,
 require
, umd = {

                 // This will store the last id used in define calls (not forcing factory), so that an anonymous module can be created from the entry point.
                 'e': 'object' == typeof module && 'filename' in module && 'exports' in module,
                 // The main point of providing requirejs support is from any options to requirejs which may need to be set withing other modules. Generally 
                 // the requirejs constructor function will not be called from within optimized bundles but it is available if needed. 
                 'requirejs': i,
                 'define': e,
                 // option data is generally set with require("brace_umd").wrap_end_option({})
                 'i': 'object' == typeof r ? r : {},
                 // The support simply lists the available definition types (only the qualifier is used), in the script which can change by adding a few pieces of data.
                 'r': function(
) {

                        // Set the global data used in with amd definitions.
                        var e = {
                               // auto_anonymous relies on define_proxy do it must be used if that option is set.
                               'define': !this.i.auto_anonymous && this.define || this.t,
                               'requirejs': this.requirejs || this.o,
                               'require': this.requirejs || this.e && module.require || this.factory,
                               'factory': this.factory
                        };
                        this.i.force_type in e && (
e.requirejs = e.require = e.define = e.factory = e[this.i.force_type]
)
,
 define = e.define
,
 requirejs = e.requirejs
, require = e.require;

                 },
                 'n': !1,
                 'factory': function(
e
,
 i
,
 r
,
 t) {

                        // The _factory argument is the default definition type and thusly is expected to exist. This method will add the module to the native 
                        // global object (or whatever the first parameter is) or to the module.exports if this is ran in a commonjs environment. All module dependencies 
                        // need to be already added to the object before the module is called (which requirejs does nicely). The module  will fail to load with a 
                        // message if any dependencies are unavailable. It is then up to the developer to re-order the modules so they load in the correct order.
                        // These checks shift the arguments sense an id string and dependency array are not mandatory.
                        e && e.constructor === Array ? (

                        // Here the dependencies and callbacks were only specified.
                        t = r
,
 r = i
,
 i = e
,
 e = ''
) : 'string' != typeof e && (

                        // ..and only if a function was passed in.
                        t = i
,
 r = e
,
 i = [
 'require' 
]
,
 e = '');

                        var o = [
]
,
 n = umd.e && module.require || u.require
, f = '';

                        // Gather the objects listed as dependencies from the factory object and store them in a temporary array. These will be passed to the new factory
                        // object as parameters but will not be deleted sense the parameters will hold individual links to the modules.
                                                if (
i.every(
function(
e) {

                               return e = e.replace(
/^\.[\/,\\]/
,
 ''
)
,
 o.push(
'require' === e && n || u[e]
)
,
 'require' === e || e in u || (
f = e
)
, !f;

                        }
)
,
 !0 !== umd.n) {

                               if (
!e) 

                               // This halts the process as the _last_define_id is expected to be used or not before this occurs.
                               return umd.n = !0
,
 void (
f ? console.log(
'The amd factory attempted to load the'
,
 e || 'anonymous'
,
 'module that specified a dependency which was not defined:'
,
 f
) : umd.e ? module.exports = r.apply(
r.prototype
,
 o
) : r.apply(
r.prototype
,
 o
));

                               umd.n = e;
                               // A anonymous module will not be created if one already exists so it will be set to true which halts the process.
                                                }
                        // The property is added to the factory object if the module was not anonymous. It is necessary to use module.exports directly as creating 
                        // links to it does not have the same effect.
                                                umd.e ? module.exports[e] = r.apply(
r.prototype
,
 o
) : u[e] = r.apply(
r.prototype
,
 o);

                 },
                 // It is not an issue if extra keys are put here that are not defined in the current version of requirejs or amdefine. If any older versions 
                 // of the definition scripts contain different property namespace, than they can be included in the Array as well. The purpose of these it to 
                 // load the modules if they are passed into the main enclosure as undefined.
                 'f': [
 'config'
,
 'nextTick'
,
 'version'
,
 'jsExtRegExp'
,
 'isBrowser'
,
 's'
,
 'toUrl'
,
 'undef'
,
 'defined'
,
 'specified'
,
 'onError'
,
 'createNode'
,
 'load'
,
 'exec' ],

                 'u': [
 'amd'
,
 'require' ],

                 't': function(
) {

                        // This member will load the module using the requested definition type if it does not exist yet. If the definition type is not found in the 
                        // environment than the factory will be used (the factory is the default definition type).
                        if (
umd.e && !umd.define) try {

                               for (
var e in umd.define = module.require(
'amdefine'
)(
module
)
,
 umd.define) umd.t[e] = umd.define[e];

                        } catch (
r) {}

                        // Use the module or use the factory (unless force type is set).
                                                var i = umd.define || umd.factory;
                        // Turn the proxy function back into the original one. This function will never be called again sense it is overwritten here. This can only
                        // happen if auto_anonymous is not set sense that relies on the proxy to function.
                                                i == umd.define && umd.i.auto_anonymous ? !0 !== umd.n && 'string' == typeof arguments[0] ? umd.n = arguments[0] : 'string' != typeof arguments[0] && (
umd.n = !0
) : (
umd.t = i
, 

                        // Resetting the global variable data is necessary when re-assigning umd object data.
                        umd.r(
)
)
,
 i.apply(
i.prototype
,
 arguments);

                 },
                 'o': function(
) {

                        if (
umd.e) try {

                               umd.requirejs = module.require(
'requirejs');

                        } catch (
e) {}

                        umd.o = umd.requirejs || umd.factory
, 

                        // Re-setting the global variable data is necessary when re-assigning umd object data.
                        umd.r(
)
,
 umd.o.apply(
umd.o.prototype
,
 arguments);

                 }
          };
          // These two loops will set the properties of the wrapping functions of requirejs and define above to load the module if it does not exist and than 
          // return the request property.
                    for (
var t in umd.u
) umd.t.__defineGetter__(
umd.u[t]
,
 (
function(
e) {

                 if (
umd.e && !umd.define) try {

                        // This will actually set the property of this property which is a getter. The new property will be the module property. The updated property 
                        // value is available immediately and this function will be garbage collected by the ecma engine as soon as it returns (this can only happen 
                        // if the property is set via a function).
                        for (
var i in umd.define = module.require(
'amdefine'
)(
module
)
,
 umd.define) 

                        // The getter must first be deleted before a standard property is set to this Object or the property will not be overwritten.
                        delete this[i]
, this[i] = umd.define[i];

                        return umd.define[e];
                        // This catch happens when an amdefine property is used but the amdefine module is not available. The script will function correctly 
                        // but whatever was used will not have the intended affect. E.g. The define.require will return undefined instead.
                                  } catch (
r) {}

                 // Return the Object property of the definition type. This is the last time this function can be accessed because the property is re-set above.
                 // The bind is needed to store the key value from the loop (ECMA 6 fixes this with the let keyword but this script is designed for browsers as well).
                 // Bind can be passed a null prototype here because the getter will either call the function with the prototype or the function is re-made with
                 // new Function() call and placed into the prototype chain of the Object.
                    }
).bind(
null
,
 umd.u[t]
));

          // The requirejs constructor is also provided for convenience.
          // ----- This is the same design as above so comments are omitted.
                    if (
!requirejs
) for (
var t in umd.f
) umd.o.__defineGetter__(
umd.f[t]
,
 (
function(
e) {

                 if (
umd.e) try {

                        return umd.requirejs = module.require(
'requirejs'
)
,
 umd.o = umd.requirejs
, 

                        // Re-setting the global variable data is necessary when re-assigning umd object data.
                        umd.r(
)
, umd.requirejs[e];

                 } catch (
i) {

                        return;
                 }
          }
).bind(
null
,
 umd.f[t]
));

          umd.r(
)
, 

          // ---- Module definitions are added here. ---------------------------------------------------------------;


define("second_module", [], function() {

  var id = "second_module"
  var mod = {}
  mod.id = id
  return mod
})

define('base_module',["second_module"], function(second) {

	var m = function() {
	
	return {second: second}
  }

  m.id = "base_module"

  return m
  
})
;

          umd.n.length && define(
[
 umd.n 
]
,
 function(
e) {

                 return e;
          });

   }
)(
this
,
 'function' == typeof define && define || void 0
,
 'function' == typeof requirejs && requirejs || void 0
,{"force_type":"factory","auto_anonymous":true});
