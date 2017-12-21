






























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
!(function(e,i,r,t){
var define,requirejs,require,




































































































































































































n,umd={

// This will store the last id used in define calls (not forcing factory), so that an anonymous module can be created from the entry point.
"e":"object"==typeof module,
"i":false,
"factory":function(i,r,t,n){

// _factory is the default definition type and thusly is expected to exist.
// This method will add the module to the native global Object (or whatever the first parameter is) or module.exports if in a commonjs environment.
// The dependencies will have to be already added to the Object before this module is called (which requirejs does nicely). The module 
// will fail to load with a message if any dependencies are unavailable. It is then up to the developer to re-order the modules so they load 
// in the correct order. A string id is required to define the module if the platform is a browser.
// These checks shift the arguments sense an id string and dependency array are not mandatory.
if(i&&i.constructor===Array){

// Here the dependencies and callbacks were only specified.
n=t

t=r

r=i

i=""
}else if("string"!==typeof i){

// ..and only if a function was passed in.
n=r

t=i

r=[]

i=""
}
// callback = typeof callback = function && callback || function(){}
// A module definition is created with an empty id and one dependency if the auto_anonymous option is used. The primary module (which is passed
// in as the only dependency of the newly created module), is identified as the last module found in the definition sequences. Note: using the 
// requirejs optimizer ensures that this happens.
var factory=this.e&&module.exports||e,f=[],o=/^\.[\/,\\]/,u=false

if(true!==this.i){
if(i){
this.i=i
}else{

// This halts the process as the _last_define_id is expected to be used or not before this occurs.
this.i=true


;// This can be a thing in browsers as long as the native object is passed in empty
if(!this.e){
//|| !Object.keys(factory).length !== this._total_modules ) 
return!!void 0
}else{

// Gather the objects listed as dependencies from the factory and store them in a temporary array. These will be passed to the new factory
// object as parameters but will not be delete sense the parameters will hold individual links to the modules. Note: the modules passed in 
// as dependencies will be garbage once the function scope is lost which may not be desirable from a program execution design standpoint.
if(!r.every(function(e){
e=e.replace(o,"")

if("require"===e||!(e in factory)){

// returns false
return!!void 0
}else{
return true
}
})){
return null
}
u=true

f=r.map(function(e,i){
return this[e.replace(o,"")]
},factory)


;// The factory now contains the anonymous module with the dependencies stored in link limbo via the arguments object.
if(this.e){
module.exports=t.apply(t.prototype,f)
}else{
e=t.apply(t.prototype,f)
}
}
}
}
if(!u&&r.every(function(e){

// Remove the ./ at the front of the dependency id. This can be done sense it is superfluous in AMD module syntax but the requirejs
// optimizer will add it to the build file define structure it generates.
e=e.replace(o,"")

if("require"===e){
return true
}else if(!(e in factory)){

// returns false
return!!void 0
}else{
return true
}
})){

// Use the module exporter if the environment has one or simply use the global instance passed in the umd.
factory[i]=t.apply(t.prototype,r.map(function(e,i){
return this[e.replace(o,"")]
},factory))
}
},

// The main point of providing requirejs support is from any options to requirejs which may need to be set withing other modules. Generally 
// the requirejs constructor function will not be called from within optimized bundles but it is available if needed. 
"requirejs":r,
"define":i,

// option data is generally set with require("brace_umd").wrap_end_option({})
"r":"object"==typeof t&&t||{},

// The support simply lists the available definition types (only the qualifier is used), in the script which can change by adding a few pieces of data.
"t":function(){
var e={

// auto_anonymous relies on define_proxy do it must be used if that option is set.
"define":!this.r.auto_anonymous&&this.define||this.n,
"requirejs":this.requirejs||this.f,
"require":this.requirejs||this.e&&module.require||this.factory.bind(this),
"factory":this.factory.bind(this)
},i=this.r.force_type&&""+this.r.force_type||""

if(i){
if(!i in e){
void 0
}else{

// Set all of the define types to the forced type so that it is only ever called.
void 0

e.requirejs=e.require=e.define=e.factory=e[i]
}
}
define=e.define

requirejs=e.requirejs

require=e.require
},

// It is not an issue if extra keys are put here that are not defined in the current version of requirejs or amdefine. If any older versions 
// of the definition scripts contain different property namespace, than they can be included in the Array as well. The purpose of these it to 
// load the modules if they are passed into the main enclosure as undefined.
"o":["config","nextTick","version","jsExtRegExp","isBrowser","s","toUrl","undef","defined","specified","onError","createNode","load","exec"],
"u":["amd","require"],
"n":function(){
var e,i


;// This member will load the module using the requested definition type if it does not exist yet. If the definition type is not found in the 
// environment than the factory will be used (the factory is the default definition type).
if(umd.e&&!umd.define){
try{
umd.define=module.require("amdefine")(module)

for(e in umd.define){
umd.n[e]=umd.define[e]
}
}catch(r){
void 0
}
}
// Use the module or use the factory (unless force type is set).
i=umd.define||umd.factory.bind(this)


;// This can be verbose logging
if(i==umd.define){
void 0
}else{
void 0
}
// Turn the proxy function back into the original one. This function will never be called again sense it is overwritten here. This can only
// happen if auto_anonymous is not set sense that relies on the proxy to function.
if(i!=umd.define||!umd.r.auto_anonymous){
umd.n=i


;// Resetting the global variable data is necessary when re-assigning umd object data.
umd.t()
}else if(true!==umd.i&&"string"===typeof arguments[0]){
umd.i=arguments[0]
}else if("string"!==typeof arguments[0]){
umd.i=true
}
i.apply(i.prototype,arguments)
},
"f":function(){
if(umd.e){
try{
umd.requirejs=module.require("requirejs")
}catch(e){
void 0
}
}
void 0

umd.f=umd.requirejs||umd.factory.bind(umd)


;// Re-setting the global variable data is necessary when re-assigning umd object data.
umd.t()

umd.f.apply(umd.f.prototype,arguments)
}
}

;// These two loops will set the properties of the wrapping functions of requirejs and define above to load the module if it does not exist and than 
// return the request property.
for(n in umd.u){
umd.n.__defineGetter__(umd.u[n],function(e){
if(umd.e&&!umd.define){
try{
umd.define=module.require("amdefine")(module)


;// This will actually set the property of this property which is a getter. The new property will be the module property. The updated property 
// value is available immediately and this function will be garbage collected by the ecma engine as soon as it returns (this can only happen 
// if the property is set via a function).
for(var i in umd.define){

// The getter must first be deleted before a standard property is set to this Object or the property will not be overwritten.
delete this[i]

this[i]=umd.define[i]
}
void 0

return umd.define[e]
}catch(r){

// console.log returns undefined which is what is desired
return
}
}
}.bind(null,umd.u[n]))
}
// The requirejs constructor is also provided for convenience.
// ----- This is the same design as above so comments are omitted.
if(!requirejs){
for(n in umd.o){
umd.f.__defineGetter__(umd.o[n],function(e){
if(umd.e){
try{
umd.requirejs=module.require("requirejs")

void 0

umd.f=umd.requirejs


;// Resetting the global variable data is necessary when re-assigning umd object data.
umd.t()

return umd.requirejs[e]
}catch(i){
return
}
}
}.bind(null,umd.o[n]))
}
}
umd.t()


;// ---- Module definitions are added here.
// Code below here is put into the wrap_end fragment. -------------------------------------------------------
// If _last_define_id is a string (which has a length), than an anonymous module needs to be made.;