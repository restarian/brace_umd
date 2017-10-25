






























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
!(function(i,e,t,s){
var __filename,__dirname,define,requirejs,require,




























































































































o,umd={

// This will store the last id used in define calls (not forcing factory), so that an anonymous module can be created from the entry point.
"i":"object"==typeof module,
"e":false,
"filename":"",

// _factory is the default definition type and thusly is expected to exist.
"factory":function(e,t,s,o){

// This method will add the module to the native global Object (or whatever the first parameter is). The dependencies will have to be already 
// added to the Object before this module is called. The module will fail to load with a message if ANY dependencies are unavailable. It is then 
// up to the developer to re-order the modules so they load in the correct order. A string id is required to define the module if the platform 
// is a browser.
if(e&&e.constructor===Array&&umd.i){

// Shift the arguments over sense the id string is not always required.
o=s

s=t

t=e

e=umd.filename
}
if("string"!==typeof e){
void 0
}else if(t.every(function(e){
return e in i||!!void 0
})){
i[e]=s.apply(s.prototype,t.map(function(i,e){
return this[i]
},i))
}
},

// The main point of providing requirejs support is from any options to requirejs which may need to be set withing other modules. Generally 
// the requirejs constructor function will not be called from within optimized bundles but it is available if needed. 
"requirejs":t,
"define":e,

// option data is generally set with require("brace_umd").wrap_end_option({})
"t":"object"==typeof s&&s||{},

// The support simply lists the available definition types (only the qualifier is used), in the script which can change by adding a few pieces of data.
"s":function(){
var i={

// auto_anonymous relies on define_proxy do it must be used if that option is set.
"define":!this.t.auto_anonymous&&this.define||this.o.bind(this),
"requirejs":this.requirejs||this.r.bind(this),
"require":this.requirejs||this.i&&module.require||this.factory,
"factory":this.factory
},e=this.t.force_type&&""+this.t.force_type||""

if(e){
if(!e in i){
void 0
}else{

// Set all of the define types to the forced type so that it is only ever called.
void 0

i.requirejs=i.require=i.define=i.factory=i[e]
}
}
define=i.define

requirejs=i.requirejs

require=i.require
},

// It is not an issue if extra keys are put here that are not defined in the current version of requirejs or amdefine. If any older versions 
// of the definition scripts contain different property namespace, than they can be included in the Array as well. The purpose of these it to 
// load the modules if they are passed into the main enclosure as undefined.
"n":["config","nextTick","version","jsExtRegExp","isBrowser","s","toUrl","undef","defined","specified","onError","createNode","load","exec"],
"f":["amd","require"],
"o":function(){
var i,e


;// This member will load the module using the requested definition type if it does not exist yet. If the definition type is not found in the 
// environment than the factory will be used (the factory is the default definition type).
if(umd.i&&!this.define){
try{
this.define=module.require("amdefine")(module)

for(i in this.define){
this.o[i]=this.define[i]
}
}catch(t){
void 0
}
}
// Use the module or use the factory (unless force type is set).
e=this.define||this.factory.bind(this)


;// This can be verbose logging
if(e==this.define){
void 0
}else{
void 0
}
// Turn the proxy function back into the original one. This function will never be called again sense it is overwritten here. This can only
// happen if auto_anonymous is not set sense that relies on the proxy to function.
if(e!=this.define||!this.t.auto_anonymous){
this.o=e


;// Resetting the global variable data is necessary when reassigning proxy data.
this.s()
}else if(true!==this.e&&arguments.length>2){
this.e=arguments[0]
}else if(arguments.length<=2){
this.e=true
}
e.apply(e.prototype,arguments)
},
"r":function(){
var i,e

if(commonjs_available&&!this.requirejs){
try{
this.requirejs=this.h.require("requirejs")

for(i in this.requirejs){
this.r[i]=this.requirejs[i]
}
}catch(t){
void 0
}
}
void 0

e=this.requirejs||this.factory

this.r=e

e.apply(e.prototype,arguments)
}
}

;// These two loops will set the properties of the wrapping functions of requirejs and define above to load the module if it does not exist and than 
// return the request property.
for(o in umd.f){
umd.o.__defineGetter__(umd.f[o],function(i){
if(commonjs_available&&!umd.define){
try{
umd.define=module.require("amdefine")(module)


;// This will actually set the property of this property which is a getter. The new property will be the module property. The updated property 
// value is available immediately and this function will be garbage collected by the ecma engine as soon as it returns (this can only happen 
// if the property is set via a function).
for(var e in umd.define){

// The getter must first be deleted before a standard property is set to this Object or the property will not be overwritten.
delete this[e]

this[e]=umd.define[e]
}
void 0

return umd.define[i]
}catch(t){

// console.log returns undefined which is what is desired
return
}
}
}.bind(null,umd.f[o]))
}
// The requirejs constructor is also provided for convenience.
// ----- This is the same design as above so comments are omitted.
for(o in umd.n){
umd.r.__defineGetter__(umd.n[o],function(i){
if(commonjs_available&&!umd.requirejs){
try{
umd.requirejs=module.require("requirejs")

for(var e in umd.requirejs){
delete this[e]

this[e]=umd.requirejs[e]
}
void 0

return umd.requirejs[e]
}catch(t){
return
}
}
}.bind(null,umd.n[o]))
}
__filename=umd.i&&module.filename||""

__dirname=umd.i&&module.require("path").dirname(__filename)||""

umd.s()


;// The file name using commonjs path module. Otherwise, the factory will require an id to work in non-nodejs environments.
if(umd.i){
umd.filename=module.require("path").basename(__filename)
}
// ---- Module definitions are added here.
// ----------------------
// Code below here is put into the wrap_end fragment. -------------------------------------------------------
// If _last_define_id is a string (which has a length), than an anonymous module needs to be made.;


define('module_one',[], function() {
  var id = "module_one"
  console.log(id + " has initialized.")
  var mod = {}
  mod.id = id
  return mod
})
;


define("second_module", [], function() {
  var id = "second_module"
  console.log(id + " has initialized.")
  var mod = {}
  mod.id = id
  return mod
})
;

var requirejs = require("requirejs")

requirejs.config({baseUrl: __dirname, nodeRequire: require})

requirejs(["module_one", "second_module"], function(one, two) {

  var id = "entry"
  console.log(id + " has initialized.")
  var mod = {}
  mod.id = id
  mod[one.id] = one
  mod[two.id] = two
  console.log(one, two)
  return mod
})
;
define("entry", function(){});

umd.e.length&&define([umd.e],function(i){
return i
})
})(this,"function"===typeof define&&define||undefined,"function"===typeof requirejs&&requirejs||undefined,{})
