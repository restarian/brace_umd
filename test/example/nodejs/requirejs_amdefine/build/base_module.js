/* Copyright (c) 2018 Robert Steckroth <RobertSteckroth@gmail.com>

Brace UMD resides under the MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

Brace Umd is a module building platform with an integrated unified module definition wrapper.

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. *///Smeh
/* Copyright (c) 2018 Robert Steckroth <RobertSteckroth@gmail.com>

Brace UMD resides under the MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

Brace Umd is a module building platform with an integrated unified module definition wrapper.

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */
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

          var define
,
 requirejs
,
 require
,













































































































































































 t
, umd = {

                 // This will store the last id used in define calls (not forcing factory), so that an anonymous module can be created from the entry point.
                 'e': 'object' == typeof module && 'filename' in module && 'exports' in module,
                 // The main point of providing requirejs support is from any options to requirejs which may need to be set withing other modules. Generally 
                 // the requirejs constructor function will not be called from within optimized bundles but it is available if needed. 
                 'requirejs': i,
                 'define': e,
                 // option data is generally set with require("brace_umd").wrap_end_option({})
                 'i': 'object' == typeof r && r || {},
                 // The support simply lists the available definition types (only the qualifier is used), in the script which can change by adding a few pieces of data.
                 'r': function(
) {

                        // Set the global data used in with amd definitions.
                        var e = {
                               // auto_anonymous relies on define_proxy do it must be used if that option is set.
                               'define': !this.i.auto_anonymous && this.define || this.t,
                               'requirejs': this.requirejs || this.n,
                               'require': this.requirejs || this.e && module.require || this.factory,
                               'factory': this.factory
                        };
                        if (
this.i.force_type in e) e.requirejs = e.require = e.define = e.factory = e[this.i.force_type];

                        define = e.define;
                        requirejs = e.requirejs;
                        require = e.require;
                 },
                 'f': false,
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
                        if (
e && e.constructor === Array) {

                               // Here the dependencies and callbacks were only specified.
                               t = r;
                               r = i;
                               i = e;
                               e = '';
                        } else if (
'string' !== typeof e) {

                               // ..and only if a function was passed in.
                               t = i;
                               r = e;
                               i = [
 'require' ];

                               e = '';
                        }
                        var n = [
]
,
 f = umd.e && module.require || u.require
, o = '';

                        // Gather the objects listed as dependencies from the factory object and store them in a temporary array. These will be passed to the new factory
                        // object as parameters but will not be deleted sense the parameters will hold individual links to the modules.
                                                i.every(
function(
e) {

                               e = e.replace(
/^\.[\/,\\]/
,
 '');

                               n.push(
'require' === e && f || u[e]);

                               if (
'require' !== e && !(
e in u
)) o = e;

                               return !o;
                        });

                        if (
true !== umd.f
) if (
e) umd.f = e;

                        // A anonymous module will not be created if one already exists so it will be set to true which halts the process.
                         else {
                               // This halts the process as the _last_define_id is expected to be used or not before this occurs.
                               umd.f = true;
                               if (
!o
) if (
umd.e
) module.exports = r.apply(
r.prototype
,
 n
); else r.apply(
r.prototype
,
 n); else void 0;

                               return;
                        }
                        // The property is added to the factory object if the module was not anonymous. It is necessary to use module.exports directly as creating 
                        // links to it does not have the same effect.
                                                if (
umd.e
) module.exports[e] = r.apply(
r.prototype
,
 n
); else u[e] = r.apply(
r.prototype
,
 n);

                 },
                 // It is not an issue if extra keys are put here that are not defined in the current version of requirejs or amdefine. If any older versions 
                 // of the definition scripts contain different property namespace, than they can be included in the Array as well. The purpose of these it to 
                 // load the modules if they are passed into the main enclosure as undefined.
                 'o': [
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

                        var e
, i;

                        // This member will load the module using the requested definition type if it does not exist yet. If the definition type is not found in the 
                        // environment than the factory will be used (the factory is the default definition type).
                        if (
umd.e && !umd.define) try {

                               umd.define = module.require(
'amdefine'
)(
module);

                               for (
e in umd.define) umd.t[e] = umd.define[e];

                        } catch (
r) {}

                        // Use the module or use the factory (unless force type is set).
                                                i = umd.define || umd.factory;
                        // Turn the proxy function back into the original one. This function will never be called again sense it is overwritten here. This can only
                        // happen if auto_anonymous is not set sense that relies on the proxy to function.
                                                if (
i != umd.define || !umd.i.auto_anonymous) {

                               umd.t = i;
                               // Resetting the global variable data is necessary when re-assigning umd object data.
                                                              umd.r(
);

                        }
                        // An amd definition will have at least two arguments if it has an id.
                         else if (
true !== umd.f && 'string' === typeof arguments[0]) umd.f = arguments[0];

                        // A anonymous module will not be created if one already exists so it will be set to true which halts the process.
                         else if (
'string' !== typeof arguments[0]) umd.f = true;

                        i.apply(
i.prototype
,
 arguments);

                 },
                 'n': function(
) {

                        if (
umd.e) try {

                               umd.requirejs = module.require(
'requirejs');

                        } catch (
e) {}

                        umd.n = umd.requirejs || umd.factory;
                        // Re-setting the global variable data is necessary when re-assigning umd object data.
                                                umd.r(
);

                        umd.n.apply(
umd.n.prototype
,
 arguments);

                 }
          };
          // These two loops will set the properties of the wrapping functions of requirejs and define above to load the module if it does not exist and than 
          // return the request property.
          for (
t in umd.u
) umd.t.__defineGetter__(
umd.u[t]
,
 (
function(
e) {

                 if (
umd.e && !umd.define) try {

                        umd.define = module.require(
'amdefine'
)(
module);

                        // This will actually set the property of this property which is a getter. The new property will be the module property. The updated property 
                        // value is available immediately and this function will be garbage collected by the ecma engine as soon as it returns (this can only happen 
                        // if the property is set via a function).
                                                for (
var i in umd.define) {

                               // The getter must first be deleted before a standard property is set to this Object or the property will not be overwritten.
                               delete this[i];
                               this[i] = umd.define[i];
                        }
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
t in umd.o
) umd.n.__defineGetter__(
umd.o[t]
,
 (
function(
e) {

                 if (
umd.e) try {

                        umd.requirejs = module.require(
'requirejs');

                        umd.n = umd.requirejs;
                        // Re-setting the global variable data is necessary when re-assigning umd object data.
                                                umd.r(
);

                        return umd.requirejs[e];
                 } catch (
i) {

                        return;
                 }
          }
).bind(
null
,
 umd.o[t]
));

          umd.r(
);

          // ---- Module definitions are added here. ---------------------------------------------------------------;


define("second_module", [], function() {

  var id = "second_module"
  var mod = {}
  mod.id = id
  return mod
})
;

define('base_module',["second_module"], function(dependency) {

  var id = "base_module"
  var mod = {}
  mod.id = id
  mod[dependency.id] = dependency 
  return mod
})
;

                    umd.f.length && define(
[
 umd.f 
]
,
 function(
e) {

                 return e;
          });

          // Code below here is put into the wrap_end fragment. -------------------------------------------------------
          // If _last_define_id is a string (which has a ength), than an anonymous module needs to be made.
          // These need to be passed into the function so that the namespace can be used again without re-setting the values (see how variable hosting works in 
          // javascript for more information).
      }
)(
this
,
 'function' === typeof define && define || undefined
,
 'function' === typeof requirejs && requirejs || undefined
,{"auto_anonymous":true});
