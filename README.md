# Brace UMD
### Synopsis

#### A unified module definition script to support Requirejs and AMDefine definitions while working seamlessly with the RequireJs optimizer and native global Objects.

[![Build status](https://ci.appveyor.com/api/projects/status/8ou8s3c7ocq0972h/branch/master?svg=true)](https://ci.appveyor.com/project/restarian/brace-umd/branch/master) [![Build Status](https://travis-ci.org/restarian/brace_umd.svg?branch=master)](https://travis-ci.org/restarian/brace_umd) [![Downloads](https://img.shields.io/npm/dm/brace_umd.svg?svg=true)](https://npmjs.org/package/brace_umd)


| A part of the [Brace suite](https://github.com/restarian/restarian/blob/master/brace/README.md)| Developed with Windows 10 and Ubuntu 16 
| ---- | ----
| ![Brace](https://raw.githubusercontent.com/restarian/restarian/master/brace/doc/image/brace_logo_small.png) | [![Ubuntu on Windows](https://raw.githubusercontent.com/restarian/restarian/master/doc/image/ubuntu_windows_logo.png)](https://github.com/Microsoft/BashOnWindows) | 


------

### Document pages
* [(Re)building the source](https://github.com/restarian/brace_umd/blob/master/doc/build.md)
* [Exported module data ](https://github.com/restarian/brace_umd/blob/master/doc/exported_data.md)
* [License information](https://github.com/restarian/brace_umd/blob/master/doc/license.md)
* [Using Brace UMD with the Requirejs optimizer](https://github.com/restarian/brace_umd/blob/master/doc/optimizer.md)
* [Available option data](https://github.com/restarian/brace_umd/blob/master/doc/options.md)
* [How to use option data](https://github.com/restarian/brace_umd/blob/master/doc/passing_option_data.md)
* [Specifications](https://github.com/restarian/brace_umd/blob/master/doc/specification.md)
* [Todo](https://github.com/restarian/brace_umd/blob/master/doc/todo.md)

----

**Author: Robert Steckroth, _Bust0ut_ [<RobertSteckroth@gmail.com>](mailto:robertsteckroth@gmail.com)**

**Licensed under: MIT WITH BSD-2-Clause**

**Bonuses:**
* Creates zero dependency modules for quick testing and integration prototyping
* Optional automatic anonymous modules creation for amdefine and commonjs modules at run-time
* Expands to incorporate other asynchronous module definitions
* Adds only one new namespace (_umd_), through self-destructing proxy methods
* Provides a way to switch between definition types without altering source code
* Allows for almost total minification of wrapped source code using almost all of the uglify-js options
* Well commented, professionally engineered, and thoroughly documented code
* Vast and deep unit tests on Windows 10 and Ubuntu 16 with multiple browsers.

**Caveats:**
* It is not yet tested in browser environments
* Has a smidgen of execution over-head
* Requires nodejs version 5 or greater

Note: An id string must be used in order to have native global Object support in environments other than nodejs when the requirejs optimizer is not going to be used. Otherwise, the id can be omitted when working with the other definitions. However, this is not an issue if the module is ran through the requirejs optimizer (which will add a id to all the modules).

**Brace UMD is better than other more simple module definitions** by providing _uglify-js_ functionality and option passing. The AMD library is only loaded and used if the correlated call to it is contained within the script. E.g. The *amdefine* module is not loaded unless a call to *define* is inside of the script. Otherwise, a proxy function is supplied for the supported definitions.

**It is acceptable to use mangle and mangle properties** with the UMD source and in the requirejs optimizing process. This is done by storing the build config options used and then passing them back into uglify-js via the r.js build config file (see [using with requirejs](https://github.com/restarian/brace_umd/blob/master/doc/optimizer.md), for more information.

**Below is the umd script from this package which is built with the included *build_umd* program. The following code will work in nodejs or the browser, on windows or linux, and with none or any of the supported definitions types:**

```javascript
/* Generated by Brace_UMD 0.6.3 */
!function(e, i, t, o) {
    var __filename, __dirname, define, requirejs, require, umd = {
        e: 'object' == typeof module,
        i: !1,
        filename: '',
        factory: function(i, t, o, s) {
            i && i.constructor === Array && this.e && (s = o, o = t, t = i, i = this.filename), 
            'string' != typeof i ? console.log('The factory Object is being used but the module does not supply an id parameter. Skipping loading of the module.') : t.every(function(t) {
                return 'require' === t || (t = t.replace(/^\.[\/,\\]/, ''), ('factory' !== this.t.force_type || t in e) && (!this.e || t in module.exports) && t in e || !!console.log('The dependency', t, 'is not loaded into the factory. Skipping loading of the module', i));
            }, this) && (this.e ? module.exports[i] = o.apply(o.prototype, t.map(function(e, i) {
                return this[e.replace(/^\.[\/,\\]/, '')];
            }, module.exports)) : e[i] = o.apply(o.prototype, t.map(function(e, i) {
                return this[e.replace(/^\.[\/,\\]/, '')];
            }, e)));
        },
        requirejs: t,
        define: i,
        t: 'object' == typeof o && o || {},
        o: function() {
            var e = {
                define: !this.t.auto_anonymous && this.define || this.s.bind(this),
                requirejs: this.requirejs || this.n.bind(this),
                require: this.requirejs || this.e && module.require || this.factory.bind(this),
                factory: this.factory.bind(this)
            }, i = this.t.force_type && this.t.force_type.toString() || '';
            i && (!i in e ? console.log('The forced type', i, 'specified as an option is not supported by Brace UMD. Supported types are', Object.keys(e)) : (console.log('Forcing use of the definition type', i), 
            e.requirejs = e.require = e.define = e.factory = e[i])), define = e.define, requirejs = e.requirejs, 
            require = e.require;
        },
        get s() {
            if (this.e && !this.define) try {
                this.define = module.require('amdefine')(module);
            } catch (e) {
                console.log('Unable to find amdefine module.', e.message);
            }
            var e = this.define || this.factory.bind(this);
            return e == this.define ? console.log('Using proxied amdefine definition.') : console.log('Using factory proxied from amdefine call.'), 
            e == this.define && this.t.auto_anonymous ? function() {
                return !0 !== this.i && arguments.length > 2 ? this.i = arguments[0] : arguments.length <= 2 && (this.i = !0), 
                e.apply(e.prototype, arguments);
            }.bind(this) : (Object.defineProperty(this, 'define_proxy', {
                r: !0,
                h: !0,
                u: !0,
                d: e
            }), this.o(), e);
        },
        get n() {
            if (this.e && !this.requirejs) try {
                this.requirejs = module.require('requirejs');
            } catch (e) {
                console.log('Brace UMD is unable to find requirejs module.', e.message);
            }
            var e = this.requirejs || this.factory.bind(this);
            return e == this.requirejs ? console.log('Using proxied requirejs definition.') : console.log('Using factory proxied from requirejs call.'), 
            e != this.requirejs && (Object.defineProperty(this, 'requirejs_proxy', {
                r: !0,
                h: !0,
                u: !0,
                d: e
            }), this.o()), e;
        }
    };
    __filename = umd.e && module.filename || '', __dirname = umd.e && module.require('path').dirname(__filename) || '', 
    umd.o(), umd.e && (umd.filename = module.require('path').basename(__filename)), 
// -- Add your module definitions here ----------------



// ----------------------------------------------------
    umd.i.length && define([ umd.i ], function(e) {
        return e;
    });
}(this, 'function' == typeof define && define || void 0, 'function' == typeof requirejs && requirejs || void 0, {});
```
