






























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
!(function(e,i,o,t){

// This is the unified module definition script. It wraps the other module definition syntax and applies the appropriate mechanism to it. The parameters
// are named the same as the providing namespace of the definition with a underbar prepended to avoid hoisting overwrite.
// The first parameter passed in is the global Object to use as the factory if all the other types are not available.
// The _define property should be passed the amdefine module or undefined. The _requirejs argument should be the requirejs Object or undefined. The 
// last argument is the options Object. This data controls behaviors of the script (available options can be studied in the documentation).
// Other definition types can be added by copying the template from the others and supplying the correlating data.
var __filename,__dirname,define,requirejs,require,umd={

// This will store the last id used in define calls (not forcing factory), so that an anonymous module can be created from the entry point.
"e":"object"==typeof module,
"i":!1,
"filename":"",

// _factory is the default definition type and thusly is expected to exist.
"factory":function(i,o,t,n){

// This method will add the module to the native global Object (or whatever the first parameter is). The dependencies will have to be already 
// added to the Object before this module is called. The module will fail to load with a message if ANY dependencies are unavailable. It is then 
// up to the developer to re-order the modules so they load in the correct order. A string id is required to define the module if the platform 
// is a browser.
i&&i.constructor===Array&&umd.e&&(
// Shift the arguments over sense the id string is not always required.
n=t,t=o,o=i,
//	An id should be available if the environment was commonjs.
i=umd.filename),
// The factory mandates that the amd call used an id parameter or that one is available otherwise.			
"string"!=typeof i?console.log("The factory Object is being used but the module does not supply an id parameter. Skipping loading of the module."):o.every(function(o){
if("factory"===umd.o.force_type&&!(o in e)||umd.e&&!(o in module)||!(o in e)){
return o in e||!!console.log("The dependency",o,"is not loaded into the factory. Skipping loading of the module",i)
}
})&&(umd.e?
// Use the module exporter if the environment has one or simply use the global instance passed in the umd.
module.exports[i]=t.apply(t.prototype,o.map(function(e,i){
return this[e]
},e)):e[i]=t.apply(t.prototype,o.map(function(e,i){
return this[e]
},e)))
},

// The main point of providing requirejs support is from any options to requirejs which may need to be set withing other modules. Generally 
// the requirejs constructor function will not be called from within optimized bundles but it is available if needed. 
"requirejs":o,
"define":i,

// option data is generally set with require("brace_umd").wrap_end_option({})
"o":"object"==typeof t&&t||{},

// The support simply lists the available definition types (only the qualifier is used), in the script which can change by adding a few pieces of data.
"t":function(){

// Set the global data used in with amd definitions and a few extras common to javascript.
var e={

// auto_anonymous relies on define_proxy do it must be used if that option is set.
"define":!this.o.auto_anonymous&&this.define||this.n.bind(this),
"requirejs":this.requirejs||this.r.bind(this),
"require":this.requirejs||this.e&&module.require||this.factory,
"factory":this.factory
},i=this.o.force_type&&this.o.force_type.toString()||""

i&&(!i in e?console.log("The forced type",i,"specified as an option is not supported by Brace UMD. Supported types are",Object.keys(e)):(
// Set all of the define types to the forced type so that it is only ever called.
console.log("Forcing use of the definition type",i),e.requirejs=e.require=e.define=e.factory=e[i])),define=e.define,requirejs=e.requirejs,require=e.require
},

// It is not an issue if extra keys are put here that are not defined in the current version of requirejs or amdefine. If any older versions 
// of the definition scripts contain different property namespace, than they can be included in the Array as well. The purpose of these it to 
// load the modules if they are passed into the main enclosure as undefined.
"s":["config","nextTick","version","jsExtRegExp","isBrowser","s","toUrl","undef","defined","specified","onError","createNode","load","exec"],
"d":["amd","require"],
"n":function(){

// This member will load the module using the requested definition type if it does not exist yet. If the definition type is not found in the 
// environment than the factory will be used (the factory is the default definition type).
if(umd.e&&!this.define){
try{
this.define=module.require("amdefine")(module)

for(var e in this.define){
this.n[e]=this.define[e]
}
}catch(o){
console.log("Unable to find amdefine module.",o.message)
}
}
// Use the module or use the factory (unless force type is set).
var i=this.define||this.factory.bind(this)


;// This can be verbose logging
i==this.define?console.log("Using proxied amdefine definition."):console.log("Using factory proxied from amdefine call."),
// Turn the proxy function back into the original one. This function will never be called again sense it is overwritten here. This can only
// happen if auto_anonymous is not set sense that relies on the proxy to function.
i==this.define&&this.o.auto_anonymous?!0!==this.i&&arguments.length>2?this.i=arguments[0]:arguments.length<=2&&(this.i=!0):(this.n=i,
// Resetting the global variable data is necessary when reassigning proxy data.
this.t()),i.apply(i.prototype,arguments)
},
"r":function(){
if(commonjs_available&&!this.requirejs){
try{
this.requirejs=this.f.require("requirejs")

for(var e in this.requirejs){
this.r[e]=this.requirejs[e]
}
}catch(o){
console.log("Unable to find requirejs module.",o.message)
}
}
console.log("Using proxied requirejs method.")

var i=this.requirejs||this.factory

this.r=i,i.apply(i.prototype,arguments)
}
}

;// These two loops will set the properties of the wrapping functions of requirejs and define above to load the module if it does not exist and than 
// return the request property.
for(var n in umd.d){
umd.n.__defineGetter__(umd.d[n],function(e){
if(commonjs_available&&!umd.define){
try{
umd.define=module.require("amdefine")(module)


;// This will actually set the property of this property which is a getter. The new property will be the module property. The updated property 
// value is available immediately and this function will be garbage collected by the ecma engine as soon as it returns (this can only happen 
// if the property is set via a function).
for(var i in umd.define){

// The getter must first be deleted before a standard property is set to this Object or the property will not be overwritten.
delete this[i],this[i]=umd.define[i]
}
return console.log("Using proxied amdefine method."),umd.define[e]
}catch(o){

// console.log returns undefined which is what is desired
return console.log("Unable to find amdefine module.",o.message)
}
}
}.bind(null,umd.d[n]))
}
// The requirejs constructor is also provided for convenience.
// ----- This is the same design as above so comments are omitted.
for(var n in umd.s){
umd.r.__defineGetter__(umd.s[n],function(e){
if(commonjs_available&&!umd.requirejs){
try{
umd.requirejs=module.require("requirejs")

for(var i in umd.requirejs){
delete this[i],this[i]=umd.requirejs[i]
}
return console.log("Using proxied requirejs method."),umd.requirejs[i]
}catch(o){
return console.log("Unable to find requirejs module.",o.message)
}
}
}.bind(null,umd.s[n]))
}
__filename=umd.e&&module.filename||"",__dirname=umd.e&&module.require("path").dirname(__filename)||"",umd.t(),
// The file name using commonjs path module. Otherwise, the factory will require an id to work in non-nodejs environments.
umd.e&&(umd.filename=module.require("path").basename(__filename)),

// ---- Module definitions are added here.
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
umd.i.length&&define([umd.i],function(e){
return e
})
})(this,"function"==typeof define&&define||void 0,"function"==typeof requirejs&&requirejs||void 0,{"force_type":"factory"})
