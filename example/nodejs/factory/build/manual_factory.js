





























//Cool joes
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
// because of how variable hosting works. The namespace would be immediately overwritten if it wasn't predefined as argument data.
//module.require("bracket_print")
!(function(e,i,t,r){

// This is the unified module definition script. It wraps the other module definition syntax and applies the appropriate mechanism to it. The parameters
// are named the same as the providing namespace of the definition with a underbar prepended to avoid hoisting overwrite.
// The first parameter passed in is the global Object to use as the factory if all the other types are not available.
// The _define property should be passed the amdefine module or undefined. The _requirejs argument should be the requirejs Object or undefined. The 
// last argument is the options Object. This data controls behaviors of the script (available options can be studied in the documentation).
// Other definition types can be added by copying the template from the others and supplying the correlating data.
var define,requirejs,require,umd={

// This will store the last id used in define calls (not forcing factory), so that an anonymous module can be created from the entry point.
"e":"object"==typeof module&&"filename"in module&&"exports"in module,
"i":!1,
"factory":function(i,t,r,n){

// _factory is the default definition type and thusly is expected to exist.
// This method will add the module to the native global Object (or whatever the first parameter is) or module.exports if in a commonjs environment.
// The dependencies will have to be already added to the Object before this module is called (which requirejs does nicely). The module 
// will fail to load with a message if any dependencies are unavailable. It is then up to the developer to re-order the modules so they load 
// in the correct order. A string id is required to define the module if the platform is a browser.
// These checks shift the arguments sense an id string and dependency array are not mandatory.
i&&i.constructor===Array?(
// Here the dependencies and callbacks were only specified.
n=r,r=t,t=i,i=""):"string"!=typeof i&&(
// ..and only if a function was passed in.
n=t,r=i,t=["require"],i="")


;// A module definition is created with an empty id and one dependency if the auto_anonymous option is used. The primary module (which is passed
// in as the only dependency of the newly created module), is identified as the last module found in the definition sequences. Note: using the 
// requirejs optimizer ensures that this happens.
var factory=this.e&&module.exports||e,o=[],u=/^\.[\/,\\]/,f=!1

if(!0!==this.i){
if(i){
this.i=i
}else
// This can be a thing in browsers as long as the native object is passed in empty
if(
// This halts the process as the _last_define_id is expected to be used or not before this occurs.
this.i=!0,this.e){

// Gather the objects listed as dependencies from the factory and store them in a temporary array. These will be passed to the new factory
// object as parameters but will not be delete sense the parameters will hold individual links to the modules. Note: the modules passed in 
// as dependencies will be garbage once the function scope is lost which may not be desirable from a program execution design standpoint.
// This is a simple way to support requirejs syntax where the dependency can be named "require" which will pass in the requirejs loader.
//		factory.require = module.require
if(!t.every(function(e){
return e.replace(u,"")in factory
})){
return null
}
f=!0,o=t.map(function(e,i){
return this[e.replace(u,"")]
},factory),
// The factory now contains the anonymous module with the dependencies stored in link limbo via the arguments object.
this.e?module.exports=r.apply(r.prototype,o):e=r.apply(r.prototype,o)
}
}
// Remove the ./ at the front of the dependency id. This can be done sense it is superfluous in AMD module syntax but the requirejs
// optimizer will add it to the build file define structure it generates.
!f&&t.every(function(e){
return"require"!==(e=e.replace(u,""))&&e in factory
})&&(factory[i]=r.apply(r.prototype,t.map(function(e,i){
return this[e.replace(u,"")]
},factory)))
},

// The main point of providing requirejs support is from any options to requirejs which may need to be set withing other modules. Generally 
// the requirejs constructor function will not be called from within optimized bundles but it is available if needed. 
"requirejs":t,
"define":i,

// option data is generally set with require("brace_umd").wrap_end_option({})
"t":"object"==typeof r&&r||{},

// The support simply lists the available definition types (only the qualifier is used), in the script which can change by adding a few pieces of data.
"r":function(){

// Set the global data used in with amd definitions and a few extras common to javascript.
var e={

// auto_anonymous relies on define_proxy do it must be used if that option is set.
"define":!this.t.auto_anonymous&&this.define||this.n,
"requirejs":this.requirejs||this.o,
"require":this.requirejs||this.e&&module.require||this.factory.bind(this),
"factory":this.factory.bind(this)
}
this.t.force_type in e&&(e.requirejs=e.require=e.define=e.factory=e[this.t.force_type]),define=e.define,requirejs=e.requirejs,require=e.require
},

// It is not an issue if extra keys are put here that are not defined in the current version of requirejs or amdefine. If any older versions 
// of the definition scripts contain different property namespace, than they can be included in the Array as well. The purpose of these it to 
// load the modules if they are passed into the main enclosure as undefined.
"u":["config","nextTick","version","jsExtRegExp","isBrowser","s","toUrl","undef","defined","specified","onError","createNode","load","exec"],
"f":["amd","require"],
"n":function(){

// This member will load the module using the requested definition type if it does not exist yet. If the definition type is not found in the 
// environment than the factory will be used (the factory is the default definition type).
if(umd.e&&!umd.define){
try{
umd.define=module.require("amdefine")(module)

for(var e in umd.define){
umd.n[e]=umd.define[e]
}
}catch(t){}
}
// Use the module or use the factory (unless force type is set).
var i=umd.define||umd.factory.bind(this)


;// Turn the proxy function back into the original one. This function will never be called again sense it is overwritten here. This can only
// happen if auto_anonymous is not set sense that relies on the proxy to function.
i==umd.define&&umd.t.auto_anonymous?!0!==umd.i&&"string"==typeof arguments[0]?umd.i=arguments[0]:"string"!=typeof arguments[0]&&(umd.i=!0):(umd.n=i,
// Resetting the global variable data is necessary when re-assigning umd object data.
umd.r()),i.apply(i.prototype,arguments)
},
"o":function(){
if(umd.e){
try{
umd.requirejs=module.require("requirejs")
}catch(e){}
}
umd.o=umd.requirejs||umd.factory.bind(umd),

// Re-setting the global variable data is necessary when re-assigning umd object data.
umd.r(),umd.o.apply(umd.o.prototype,arguments)
}
}



;// These two loops will set the properties of the wrapping functions of requirejs and define above to load the module if it does not exist and than 
// return the request property.
for(var n in umd.f){
umd.n.__defineGetter__(umd.f[n],function(e){
if(umd.e&&!umd.define){
try{
umd.define=module.require("amdefine")(module)


;// This will actually set the property of this property which is a getter. The new property will be the module property. The updated property 
// value is available immediately and this function will be garbage collected by the ecma engine as soon as it returns (this can only happen 
// if the property is set via a function).
for(var i in umd.define){

// The getter must first be deleted before a standard property is set to this Object or the property will not be overwritten.
delete this[i],this[i]=umd.define[i]
}
return umd.define[e]
}catch(t){}
}
}.bind(
null,umd.f[n]))
}


// The requirejs constructor is also provided for convenience.
// ----- This is the same design as above so comments are omitted.
if(!requirejs){
for(var n in umd.u){
umd.o.__defineGetter__(umd.u[n],function(e){
if(umd.e){
try{


// Resetting the global variable data is necessary when re-assigning umd object data.
return umd.requirejs=module.require("requirejs"),umd.o=umd.requirejs,umd.r(),umd.requirejs[e]
}catch(i){
return
}
}
}.bind(null,umd.u[n]))
}
}
umd.r(),



// ---- Module definitions are added here. ---------------------------------------------------------------
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

							define(["equire", "first", "nope", "second"], function(req, first, nope, second) {

								return {
									id: "has_require",
									first: first,
									second: second,
									require: req 
								}
							})
						umd.i.length&&define([umd.i],function(e){
return e
})
})(this,"function"==typeof define&&define||void 0,"function"==typeof requirejs&&requirejs||void 0,{"force_type":"factory"})
