






























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
var define,requirejs,require,



































































































































































































s,umd={

// This will store the last id used in define calls (not forcing factory), so that an anonymous module can be created from the entry point.
"i":"object"==typeof module,
"e":false,
"factory":function(e,t,r,s){

// _factory is the default definition type and thusly is expected to exist.
// This method will add the module to the native global Object (or whatever the first parameter is) or module.exports if in a commonjs environment.
// The dependencies will have to be already added to the Object before this module is called (which requirejs does nicely). The module 
// will fail to load with a message if any dependencies are unavailable. It is then up to the developer to re-order the modules so they load 
// in the correct order. A string id is required to define the module if the platform is a browser.
// These checks shift the arguments sense an id string and dependency array are not mandatory.
if(e&&e.constructor===Array){

// Here the dependencies and callbacks were only specified.
s=r

r=t

t=e

e=""
}else if("string"!==typeof e){

// ..and only if a function was passed in.
s=t

r=e

t=[]

e=""
}
// callback = typeof callback = function && callback || function(){}
// A module definition is created with an empty id and one dependency if the auto_anonymous option is used. The primary module (which is passed
// in as the only dependency of the newly created module), is identified as the last module found in the definition sequences. Note: using the 
// requirejs optimizer ensures that this happens.
var factory=this.i&&module.exports||i,n=[],o=/^\.[\/,\\]/,f=false

if(true!==this.e){
if(e){
this.e=e
}else{

// This halts the process as the _last_define_id is expected to be used or not before this occurs.
this.e=true


;// This can be a thing in browsers as long as the native object is passed in empty
if(!this.i){
//|| !Object.keys(factory).length !== this._total_modules ) 
return!!void 0
}else{

// Gather the objects listed as dependencies from the factory and store them in a temporary array. These will be passed to the new factory
// object as parameters but will not be delete sense the parameters will hold individual links to the modules. Note: the modules passed in 
// as dependencies will be garbage once the function scope is lost which may not be desirable from a program execution design standpoint.
if(!t.every(function(i){
i=i.replace(o,"")

if("require"===i||!(i in factory)){

// returns false
return!!void 0
}else{
return true
}
})){
return null
}
f=true

n=t.map(function(i,e){
return this[i.replace(o,"")]
},factory)


;// The factory now contains the anonymous module with the dependencies stored in link limbo via the arguments object.
if(this.i){
module.exports=r.apply(r.prototype,n)
}else{
i=r.apply(r.prototype,n)
}
}
}
}
if(!f&&t.every(function(i){

// Remove the ./ at the front of the dependency id. This can be done sense it is superfluous in AMD module syntax but the requirejs
// optimizer will add it to the build file define structure it generates.
i=i.replace(o,"")

if("require"===i){
return true
}else if(!(i in factory)){

// returns false
return!!void 0
}else{
return true
}
})){

// Use the module exporter if the environment has one or simply use the global instance passed in the umd.
factory[e]=r.apply(r.prototype,t.map(function(i,e){
return this[i.replace(o,"")]
},factory))
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
"requirejs":this.requirejs||this.n.bind(this),
"require":this.requirejs||this.i&&module.require||this.factory,
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

// It is not an issue if extra keys are put here that are not defined in the current version of requirejs or amdefine. If any older versions 
// of the definition scripts contain different property namespace, than they can be included in the Array as well. The purpose of these it to 
// load the modules if they are passed into the main enclosure as undefined.
"o":["config","nextTick","version","jsExtRegExp","isBrowser","s","toUrl","undef","defined","specified","onError","createNode","load","exec"],
"f":["amd","require"],
"s":function(){
var i,e


;// This member will load the module using the requested definition type if it does not exist yet. If the definition type is not found in the 
// environment than the factory will be used (the factory is the default definition type).
if(umd.i&&!this.define){
try{
this.define=module.require("amdefine")(module)

for(i in this.define){
this.s[i]=this.define[i]
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
this.s=e


;// Resetting the global variable data is necessary when reassigning proxy data.
this.r()
}else if(true!==this.e&&arguments.length>2){
this.e=arguments[0]
}else if(arguments.length<=2){
this.e=true
}
e.apply(e.prototype,arguments)
},
"n":function(){
var i,e

if(this.i&&!this.requirejs){
try{
this.requirejs=this.u.require("requirejs")

for(i in this.requirejs){
this.n[i]=this.requirejs[i]
}
}catch(t){
void 0
}
}
void 0

e=this.requirejs||this.factory

this.n=e

e.apply(e.prototype,arguments)
}
}

;// These two loops will set the properties of the wrapping functions of requirejs and define above to load the module if it does not exist and than 
// return the request property.
for(s in umd.f){
umd.s.__defineGetter__(umd.f[s],function(i){
if(this.i&&!umd.define){
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
}.bind(null,umd.f[s]))
}
// The requirejs constructor is also provided for convenience.
// ----- This is the same design as above so comments are omitted.
for(s in umd.o){
umd.n.__defineGetter__(umd.o[s],function(i){
if(this.i&&!umd.requirejs){
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
}.bind(null,umd.o[s]))
}
umd.r()


;// ---- Module definitions are added here.
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


define("entry", ["module_one", "second_module"], function(one, two) {
  var id = "entry"
  console.log(id + " has initialized.")
  var mod = {}
  mod.id = id
  mod[one.id] = one
  mod[two.id] = two
  return mod
})
;
umd.e.length&&define([umd.e],function(i){
return i
})
})(module.exports,"function"===typeof define&&define||undefined,"function"===typeof requirejs&&requirejs||undefined,{})
