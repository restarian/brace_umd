
## Brace UMD
A unified module definition script to support modules written with Requirejs, CommonJs, AMDefine or the native global Object syntax while also working seamlessly with the r.js optimizer.
------------

**Author: Robert Steckroth**

**License: MIT**

**Caveat:** A id string must be used in order to have native global Object support.

**Below are some ways to use the UMD. The following code works in nodejs or the browser:**
```
// A pretty output of the minified script used below

(function(global_this) {
    var global_define = define || void 0, global_requirejs = requirejs || void 0, global_require = require || void 0, define = function() {
        Array.prototype.slice.call(arguments).unshift(global_define || "object" == typeof module && module.exports && global_module || global_this);
    }, require = function() {
        Array.prototype.slice.call(arguments).unshift(global_require || global_this);
    }, requirejs = function() {
        Array.prototype.slice.call(arguments).unshift(global_requirejs || "object" == typeof module && module.exports && global_module || global_this);
    }, global_module = function(id, deps, factory, err_cb) {
        deps = deps || [], module.exports = factory.apply(factory.prototype, deps.map(function(value, index) {
            return (global_requirejs || global_require)(value);
        }));
    }, global_this = function(id, deps, factory, err_cb) {
        "string" != typeof id ? console.warn("The global native Object needs to be used but the module id parameter is not available.") : deps.every(function(value, index) {
            return value in global_global || !!console.warn("The dependency", value, "is not loaded into the factory yet. Skipping loading of the module", id);
        }) && (global_global[id] = factory.apply(factory, deps.map(function(value, index) {
            return global_global[value];
        })));
    }, umd = function() {
        var args = Array.prototype.slice.call(arguments);
        args.shift(), arguments[0].apply(arguments[0].prototype, args);
    };

    // Calling define, require or requirejs works with all definition types here.
    requirejs([], function(){})
    requrie([], function(){})
    define([], function(){})
    define(["mod_a"], function(mod_a){
      return {}
    })

})(this);


// The same script as above but with minified code.
(function(global_this){var global_define=define||void 0,global_requirejs=requirejs||void 0,global_require=require||void 0,define=function(){var args=Array.prototype.slice.call(arguments);args.unshift(global_define||"object"==typeof module&&module.exports&&global_module||global_this);umd.apply(umd.prototype,args)},require=function(){var args=Array.prototype.slice.call(arguments);args.unshift(global_require||global_this);umd.apply(umd.prototype,args)},requirejs=function(){var args=Array.prototype.slice.call(arguments);args.unshift(global_requirejs||"object"==typeof module&&module.exports&&global_module||global_this);umd.apply(umd.prototype,args)},global_module=function(id,deps,factory,err_cb){deps=deps||[];module.exports=factory.apply(factory.prototype,deps.map(function(value,index){return(global_requirejs||global_require)(value)}))},global_this=function(id,deps,factory,err_cb){"string"!=typeof id?console.warn("The global native Object needs to be used but the module id parameter is not available."):deps.every(function(value,index){return value in global_this||!!console.warn("The dependency",value,"is not loaded into the factory yet. Skipping loading of the module",id)})&&(global_this[id]=factory.apply(factory,deps.map(function(value,index){return global_this[value]})))},umd=function(){var args=Array.prototype.slice.call(arguments);args.shift();arguments[0].apply(arguments[0].prototype,args)}


  define("my_mod", [], function() {
    id = "my_mod"
    console.log("Init", id)
    return {id: this.id}
  })


    // Calling define, require or requirejs works with all definition types here.
    requirejs([], function(){})
    require([], function(){})
    define([], function(){})
    define(["mod_a"], function(mod_a){
      return {}
    })

})(this)

```


**The generated script was generated via r.js -o require_build.js script in the requirejs_wrapped example. It works as a module definition in all platforms regardless of what is available.**
```
!function(global_this) {
    var global_define = define || void 0, global_requirejs = requirejs || void 0, global_require = require || void 0, define = function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(global_define || "object" == typeof module && module.exports && global_module || global_this);
        umd.apply(umd.prototype, args);
    }, require = function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(global_require || global_this);
        umd.apply(umd.prototype, args);
    }, requirejs = function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(global_requirejs || "object" == typeof module && module.exports && global_module || global_this);
        umd.apply(umd.prototype, args);
    }, global_module = function(id, deps, factory, err_cb) {
        deps = deps || [];
        module.exports = factory.apply(factory.prototype, deps.map(function(value, index) {
            return (global_requirejs || global_require)(value);
        }));
    }, global_this = function(id, deps, factory, err_cb) {
        "string" != typeof id ? console.warn("The global native Object needs to be used but the module id parameter is not available.") : deps.every(function(value, index) {
            return value in global_this || !!console.warn("The dependency", value, "is not loaded into the factory yet. Skipping loading of the module", id);
        }) && (global_this[id] = factory.apply(factory, deps.map(function(value, index) {
            return global_this[value];
        })));
    }, umd = function() {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        arguments[0].apply(arguments[0].prototype, args);
    };
    define("another_module", [ "another_module" ], function(a) {
        console.log("module init");
        return {
            cool: "joes"
        };
    });
    define("example_module", [ "another_module" ], function(a) {
        console.log("odule init");
        return {
            cool: "joes"
        };
    });
}(this);
```
