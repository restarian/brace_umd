
## Brace UMD
A unified module definition script to support module definitions which can use CommonJs, Requirejs, AMDefine, or the native global Object.
------------

**Author: Robert Steckroth**

**License: MIT**


**Requirejs**
the wrap fragments generated via the build script can work with rquirejs or use any of the other types.
```
// This is the unified module definition function from the build directory. It is just thee same as using the lib source file.
var umd=function(e,n,o,t){3===arguments.length&&(t=o,o=n,n=void 0,arguments[4]=t,arguments.length=arguments.length+1),"function"==typeof define&&define.amd?(console.log("Using amdefine to define the module",n||""),arguments.length>=4?define(n,o,t):define(o,t)):"object"==typeof module&&module.exports?(console.log("Using CommonJS to define module",n||""),module.exports=t.apply(t,o.map(function(e,n){return require(e)}))):(console.log("Using the native global Object to define the module",n||""),n.toString()?o.every(function(o,t){return o in e||!!console.warn("The dependency",o,"is not loaded into the engine yet. Skipping loading of the module",n||"")})&&(e[n]=t.apply(t,o.map(function(n,o){return e(n)}))):console.warn("The global native Object is going to be used but the module is parameter is not available."))};umd(this,"umd",[],function(){return umd});

if (typeof define !== 'function') { var define = require('amdefine')(module) }

umd(this, "example_mod", ["brace_prototype"], function(brace_proto) {

    console.log("My module init'ed")
    return {
      cool: "joes"
    }

})
```

**The completed build for the above module will use UMD module definitions. Below is the build output.**

```
!function() {
    var e = function(e, o, n, t) {
        3 === arguments.length && (t = n, n = o, o = void 0, arguments[4] = t, arguments.length = arguments.length + 1),
        "function" == typeof define && define.amd ? (console.log("Using amdefine to define the module", o || ""),
        arguments.length >= 4 ? define(o, n, t) : define(n, t)) : "object" == typeof module && module.exports ? (console.log("Using CommonJS to define module", o || ""),
        module.exports = t.apply(t, n.map(function(e, o) {
            return require(e);
        }))) : (console.log("Using the native global Object to define the module", o || ""),
        "" + o ? n.every(function(n, t) {
            return n in e || !!console.warn("The dependency", n, "is not loaded into the engine yet. Skipping loading of the module", o || "");
        }) && (e[o] = t.apply(t, n.map(function(o, n) {
            return e(o);
        }))) : console.warn("The global native Object is going to be used but the module is parameter is not available."));
    };
    e(this, "umd", [], function() {
        return e;
    });
    e(this, "example_mod", [ "brace_prototype" ], function(e) {
        console.log("My module init'ed");
        return {
            cool: "joes"
        };
    });
}();
```
