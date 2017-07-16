
# Brace UMD
### A unified module definition script to support modules written with Requirejs, AMDefine and CommonJs syntax while working seamlessly with the r.js optimizer and the native global Object.

[![Build status](https://ci.appveyor.com/api/projects/status/j9w4v3romfw971y9/branch/master?svg=true)](https://ci.appveyor.com/project/restarian/brace-umd/branch/master) [![Build Status](https://travis-ci.org/restarian/brace_umd.svg?branch=master)](https://travis-ci.org/restarian/brace_umd) [![Downloads](https://img.shields.io/npm/dm/brace_umd.svg?svg=true)](https://npmjs.org/package/brace_umd)

------

### Document pages
* [Build](https://github.com/restarian/brace_umd/blob/master/doc/build.md)
* [Use with r.js](https://github.com/restarian/brace_umd/blob/master/doc/optimizer.md)
* [Specification](https://github.com/restarian/brace_umd/blob/master/doc/specification.md)
* [Licenses](https://github.com/restarian/brace_umd/blob/master/doc/license.md)
* [Todo](https://github.com/restarian/brace_umd/blob/master/doc/todo.md)

----

**Author: Robert Steckroth, Bustout**

**License: MIT**

**Bonuses:**
* well commented, professional code
* thoroughly documented
* vast and deep unit tests on multiple platforms

**Caveats:**
  * An id string must be used in order to have native global Object support in environments other than nodejs. Otherwise, it can be omitted to only supply CommonJs, RequireJs, AMDefine and r.js support.


[![Bash on Windows](https://raw.githubusercontent.com/restarian/brace_umd/master/doc/image/ubuntu_windows_logo.png)](https://github.com/Microsoft/BashOnWindows)


**Below are some ways to use the UMD. The following code works in nodejs or the browser:**
```javascript
// A pretty output of the minified script used below

/* Generated by Brace_UMD 0.2.8 */
(function() {
    var e = {
        requirejs: void 0 !== requirejs && requirejs || void 0,
        define: void 0 !== define && define || void 0,
        require: void 0 !== require && require || "undefined" != typeof module && module.require.bind(module) || void 0,
        support: {
            require: !0,
            requirejs: !0,
            define: !0
        },
        use: function() {
            var e = Array.prototype.slice.call(arguments);
            e.shift();
            arguments[0].apply(arguments[0].prototype, e);
        },
        factory: arguments[0],
        force_type: arguments[0] && arguments[0].force_type || arguments[1] && arguments[1].force_type
    };
    e.global_object = function(e, o, t, r) {
        if (e && e.constructor === Array && module && module.filenmame) {
            var i = r;
            r = t;
            t = o;
            o = e;
            e = module.filenmame;
        }
        "string" != typeof e ? console.log("The global native Object is attempted to be used but the module does not supply an id parameter. Skipping loading of the module.") : o.every(function(o, t) {
            return o in this.factory || !!console.log("The dependency", o, "is not loaded into the factory yet. Skipping loading of the module", e);
        }, this) && (this.factory[e] = t.apply(t, o.map(function(e, o) {
            return this.factory[e];
        }, this)));
    }.bind(e);
    e.commonjs = function(e, o, t, r) {
        if (e && e.constructor === Array) {
            var i = r;
            r = t;
            t = o;
            o = e;
        }
        module.exports = t.apply(t.prototype, o.map(function(e, o) {
            return this.require(e);
        }, this));
    }.bind(e);
    e.force_type && (e.force_type in e.support ? e[e.force_type] ? e.requirejs = e.require = e.define = e.factory = e[e.force_type] : console.log("The forced type", e.force_type, "is not available.") : console.log("The forced type", e.force_type, "specified as an option is not supported by Brace UMD. Supported types are", Object.keys(e.support)));
    var define = function() {
        var o = Array.prototype.slice.call(arguments);
        o.unshift(e.define || "object" == typeof module && module.exports && e.commonjs || e.global_object);
        e.use.apply(e.use.prototype, o);
    }, require = function() {
        var o = Array.prototype.slice.call(arguments);
        o.unshift(e.require || global_object);
        e.use.apply(e.use.prototype, o);
    }, requirejs = function() {
        var o = Array.prototype.slice.call(arguments);
        o.unshift(e.requirejs || "object" == typeof module && module.exports && e.commonjs || e.global_object);
        e.use.apply(e.use.prototype, o);
    };

    define("my_module", [ "test_module_two" ], function(e, o) {
        console.log("Init my_module");
        return {
            one: e,
            two: o
        };
    });

    // Calling define, require or requirejs works with all definition types here.
    requirejs("my_mode", [], function(){})
    require(["another_module"], function(){})
    define([], function(){})
    define(["mod_a", "mod_b"], function(mod_a, mod_b){
      return {}
    })

}(this, {
    force_type: "requirejs"
}))


// The same script as above but with minified code.

(function(o){var e=void 0!==requirejs&&requirejs||void 0,t=void 0!==define&&define||void 0,r=void 0!==require&&require||module&&module.require.bind(module)||void 0,p=function(){var o=Array.prototype.slice.call(arguments);o.shift();arguments[0].apply(arguments[0].prototype,o)},define=function(){var o=Array.prototype.slice.call(arguments);o.unshift(t||"object"==typeof module&&module.exports&&n||i);p.apply(p.prototype,o)},require=function(){var o=Array.prototype.slice.call(arguments);o.unshift(r||i);p.apply(p.prototype,o)},requirejs=function(){var o=Array.prototype.slice.call(arguments);o.unshift(e||"object"==typeof module&&module.exports&&n||i);p.apply(p.prototype,o)},n=function(o,e,t,p){e=e||[];module.exports=t.apply(t.prototype,e.map(function(o,e){return r(o)}))},i=function(e,t,r,p){if(e&&e.constructor===Array){var n=p;p=r;r=t;t=e;e=__filename.replace(/.*[\\,\/]/g,"")}"string"!=typeof e?console.log("The global native Object needs to be used but the module id parameter is not available."):t.every(function(t,r){return t in o||!!console.log("The dependency",t,"is not loaded into the factory yet. Skipping loading of the module",e)})&&(o[e]=r.apply(r,t.map(function(e,t){return o[e]})))}

  define("my_mod", [], function() {
    id = "my_mod"
    return {id: this.id}
  })

}(this))

```

**The script below was generated via _r.js -o require_build.js_ script in the requirejs_wrapped example. It works as a module definition on all platforms regardless of what libraries are available.**

```javascript
!function(o) {
    var e = l || void 0, t = p || void 0, n = r || void 0, l = function() {
        var t = Array.prototype.slice.call(arguments);
        t.unshift(e || "object" == typeof module && module.exports && i || o);
        a.apply(a.prototype, t);
    }, r = function() {
        var e = Array.prototype.slice.call(arguments);
        e.unshift(n || o);
        a.apply(a.prototype, e);
    }, p = function() {
        var e = Array.prototype.slice.call(arguments);
        e.unshift(t || "object" == typeof module && module.exports && i || o);
        a.apply(a.prototype, e);
    }, i = function(o, e, l, r) {
        e = e || [];
        module.exports = l.apply(l.prototype, e.map(function(o, e) {
            return (t || n)(o);
        }));
    }, o = function(e, t, n, l) {
        "string" != typeof e ? console.warn("The global native Object needs to be used but the module id parameter is not available.") : t.every(function(t, n) {
            return t in o || !!console.warn("The dependency", t, "is not loaded into the factory yet. Skipping loading of the module", e);
        }) && (o[e] = n.apply(n, t.map(function(e, t) {
            return o[e];
        })));
    }, a = function() {
        var o = Array.prototype.slice.call(arguments);
        o.shift();
        arguments[0].apply(arguments[0].prototype, o);
    };
    l("another_module", [ "another_module" ], function(o) {
        console.log("module init");
        return {
            cool: "joes"
        };
    });
    l("example_module", [ "another_module" ], function(o) {
        console.log("odule init");
        return {
            cool: "joes"
        };
    });
}(this);
```
