






























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
!(function(i,e,t,r){

// This is the unified module definition script. It wraps the other module definition syntax and applies the appropriate mechanism to it. The parameters
// are named the same as the providing namespace of the definition with a underbar prepended to avoid hoisting overwrite.
// The first parameter passed in is the global Object to use as the factory if all the other types are not available.
// The _define property should be passed the amdefine module or undefined. The _requirejs argument should be the requirejs Object or undefined. The 
// last argument is the options Object. This data controls behaviors of the script (available options can be studied in the documentation).
// Other definition types can be added by copying the template from the others and supplying the correlating data.
var __filename,__dirname,define,requirejs,require,umd={

// This will store the last id used in define calls (not forcing factory), so that an anonymous module can be created from the entry point.
"i":"object"==typeof module,
"e":false,
"filename":"",

// _factory is the default definition type and thusly is expected to exist.
"factory":function(e,t,r,s){

// This method will add the module to the native global Object (or whatever the first parameter is). The dependencies will have to be already 
// added to the Object before this module is called. The module will fail to load with a message if ANY dependencies are unavailable. It is then 
// up to the developer to re-order the modules so they load in the correct order. A string id is required to define the module if the platform 
// is a browser.
if(e&&e.constructor===Array&&this.i){

// Shift the arguments over sense the id string is not always required.
s=r

r=t

t=e


;//	An id should be available if the environment was commonjs.
e=this.filename
}
// The factory mandates that the amd call used an id parameter or that one is available otherwise.			
if("string"!==typeof e){
void 0
}else if(t.every(function(e){

// Remove the ./ at the front of the dependency id. This can be done sense it is superfluous in AMD module syntax but the requirejs
// optimizer will add it to the build file define structure it generates.
if("require"===e){
return true
}
e=e.replace(/^\.[\/,\\]/,"")

if("factory"===this.t.force_type&&!(e in i)||this.i&&!(e in module.exports)||!(e in i)){
return!!void 0
}
return true
},this)){

// Use the module exporter if the environment has one or simply use the global instance passed in the umd.
if(this.i){
module.exports[e]=r.apply(r.prototype,t.map(function(i,e){
return this[i.replace(/^\.[\/,\\]/,"")]
},module.exports))
}else{
i[e]=r.apply(r.prototype,t.map(function(i,e){
return this[i.replace(/^\.[\/,\\]/,"")]
},i))
}
}
},

// The main point of providing requirejs support is from any options to requirejs which may need to be set withing other modules. Generally 
// the requirejs constructor function will not be called from within optimized bundles but it is available if needed. 
"requirejs":t,
"define":e,

// option data is generally set with require("brace_umd").wrap_end_option({})
"t":"object"==typeof r&&r||{},

// The support simply lists the available definition types (only the qualifier is used), in the script which can change by adding a few pieces of data.
"r":function(){
var i={

// auto_anonymous relies on define_proxy do it must be used if that option is set.
"define":!this.t.auto_anonymous&&this.define||this.s.bind(this),
"requirejs":this.requirejs||this.u.bind(this),
"require":this.requirejs||this.i&&module.require||this.factory.bind(this),
"factory":this.factory.bind(this)
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
get"s"(){

// This member will load the module using the requested definition type if it does not exist yet. If the definition type is not found in the 
// environment than the factory will be used (the factory is the default definition type).
if(this.i&&!this.define){
try{
this.define=module.require("amdefine")(module)
}catch(e){
void 0
}
}
// Use the module or use the factory (unless force type is set).
var i=this.define||this.factory.bind(this)


;// This can be verbose logging
if(i==this.define){
void 0
}else{
void 0
}
// Turn the proxy function back into the original one. This function will never be called again sense it is overwritten here. This can only
// happen if auto_anonymous is not set sense that relies on the proxy to function.
if(i!=this.define||!this.t.auto_anonymous){
Object.defineProperty(this,"define_proxy",{
"h":true,
"n":true,
"o":true,
"f":i
})


;// Resetting the global variable data is necessary when reassigning proxy data.
this.r()

return i
}else{
return function(){
if(true!==this.e&&arguments.length>2){
this.e=arguments[0]
}else if(arguments.length<=2){
this.e=true
}
return i.apply(i.prototype,arguments)
}.bind(this)
}
},
get"u"(){
if(this.i&&!this.requirejs){
try{
this.requirejs=module.require("requirejs")
}catch(e){
void 0
}
}
var i=this.requirejs||this.factory.bind(this)

if(i==this.requirejs){
void 0
}else{
void 0
}
if(i!=this.requirejs){
Object.defineProperty(this,"requirejs_proxy",{
"h":true,
"n":true,
"o":true,
"f":i
})


;// Resetting the global variable data is necessary when reassigning proxy data.
this.r()
}
return i
}
}
__filename=umd.i&&module.filename||""

__dirname=umd.i&&module.require("path").dirname(__filename)||""

umd.r()


;// The file name using commonjs path module. Otherwise, the factory will require an id to work in non-nodejs environments.
if(umd.i){
umd.filename=module.require("path").basename(__filename)
}
// ---- Module definitions are added here.
// ----------------------
// Code below here is put into the wrap_end fragment. -------------------------------------------------------
// If _last_define_id is a string (which has a length), than an anonymous module needs to be made.;


define("second_module", [], function() {
  var id = "second_module"
  console.log(id + " has initialized.")
  var mod = {}
  mod.id = id
  return mod
})
;


define('base_module',["second_module"], function(dependency) {
  var id = "base_module"
  console.log(id + " has initialized.")
  var mod = {}
  mod.id = id
  mod[dependency.id] = dependency 
  return mod
})
;
umd.e.length&&define([umd.e],function(i){
return i
})
})(this,"function"===typeof define&&define||undefined,"function"===typeof requirejs&&requirejs||undefined,{})
