## Synopsis

[![Build status](https://ci.appveyor.com/api/projects/status/8ou8s3c7ocq0972h/branch/master?svg=true)](https://ci.appveyor.com/project/restarian/brace-umd/branch/master) [![Downloads](https://img.shields.io/npm/dm/brace_umd.svg?svg=true)](https://npmjs.org/package/brace_umd)

| **The [Brace Suite]** | **[Ubuntu on Windows]**   |
|:---------------------:|:-------------------------:|
| ![Brace logo]         | ![Ubuntu on Windows logo] |         |

[Brace Suite]: https://github.com/restarian/restarian/tree/master/brace/
[Ubuntu on Windows]: https://www.microsoft.com/en-us/store/p/ubuntu/9nblggh4msv6?activetab=pivot%3aoverviewtab

[Ubuntu on Windows logo]: https://raw.githubusercontent.com/restarian/restarian/master/doc/image/ubuntu_windows_logo.png
[Brace logo]: https://raw.githubusercontent.com/restarian/restarian/master/brace/doc/image/brace_logo_small.png

---
### Brace Umd help pages
* **Synopsis**
* Contibutors
  * [Contributor code of conduct](https://github.com/restarian/brace_umd/blob/master/docs/contibutors/contributor_code_of_conduct.md)
  * [Guidelines for contributing](https://github.com/restarian/brace_umd/blob/master/docs/contibutors/guidelines_for_contributing.md)
* Specification
  * [License information](https://github.com/restarian/brace_umd/blob/master/docs/specification/license_information.md)
  * [Package information](https://github.com/restarian/brace_umd/blob/master/docs/specification/package_information.md)
  * [Unit test output](https://github.com/restarian/brace_umd/blob/master/docs/specification/unit_test_output.md)
* Using the project
  * [Building the umd with other options](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/building_the_umd_with_other_options.md)
  * [How option handling works](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/how_option_handling_works.md)
  * [Passing option data to the umd](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/passing_option_data_to_the_umd.md)
  * [Requirejs project configuration](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/requirejs_project_configuration.md)
  * [Using the optimizer](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/using_the_optimizer.md)
  * [What the build exports](https://github.com/restarian/brace_umd/blob/master/docs/using_the_project/what_the_build_exports.md)

---

#### More than a unified module definition:
Brace Umd is also a source-building platform to support AMD (*asynchronous module definition*) modules built by the [RequireJs](https://requirejs.org/docs/node.html) optimizer.

##### Creates a localized platform:

Individual AMD modules will store optimization build information. The module is then built, tested and distributed with a known optimization output. Other projects can then be meticulously compiled again using the same procedure for consistent package builds which consist of multiple packages and modules.

**Brace Umd is better than other more simple module definitions** by providing localized _uglify-js_ functionality and option passing.

**Licensed under: MIT WITH BSD-2-Clause**
This project relies heavily on (and includes) the [Uglify-js](https://github.com/mishoo/UglifyJS2) source code.

**Bonuses:**
* Allows for zero dependency module creation when used with the r.js optimizer and the built in factory loader
* Provides an anonymous module option for amdefine modules
* Adds only one new namespace (umd), by using a self-destructing proxy method
* Provides a way to switch between definition types without altering source code
* Allows for minification of wrapped source code using almost all of the uglify-js options
* Extensible friendly design regarding other asynchronous module definitions
* Well commented, professionally engineered and thoroughly documented code
* Vast and deep unit tests on Windows 10 and Ubuntu 18

**Caveats:**
  * Requires nodejs version 6 or greater

**Note**: it is acceptable to use mangle and mangle properties with the Umd source and in the requirejs optimizing process. This is done by storing the build config options used and then passing them back into uglify-js via the r.js build config file (see [using with requirejs](https://github.com/restarian/brace_umd/blob/master/docs/using_the_optimizer.md), for more information.

**The build process involves two RequireJs configuration files to operate. The code below is for quick access and convenience.** See help document pertaining to Requirejs configurations for more information.

```javascript
// Project optimization r_js file:
{
	"_init": module.paths.unshift(nodeRequire("path").join(config.baseUrl, "node_modules")),
	"name": nodeRequire("path").basename(config.baseUrl),
	"out": nodeRequire("path").join("build", nodeRequire("path").basename(config.baseUrl))+".js",
	"baseUrl": "lib",
	"onBuildRead": function (module_name, module_path, content) {
		// This is how a module is built which has dependency modules which use brace_umd. The non-brace_umd module version is used instead when a module is
		// loaded which was a brace_umd built module (it will contain a _umd.js suffix). It is assumed that any module which contains a _umd.js suffix is
		// a brace_umd wrapped module. Note: this should only apply when using a require.resolve as a requirejs paths value.
		return /.+_umd\.js$/.test(module_path) && nodeRequire("fs").existsSync(module_path.replace(/_umd\.js$/, ".js")) &&
				nodeRequire("fs").readFileSync(module_path.replace(/_umd\.js$/, ".js")).toString() || content
	},
	"paths": {
  // Add any external packages use in this project here with an :empty value
	//	"": "empty:"
	},
	"optimize": "uglify",
	"uglify2": nodeRequire("brace_umd").build_option,
	"keepAmdefine": false,
	"keepBuildDir": true,
	"writeBuildTxt": false,
}
```

```javascript
// Final project assembly r_js file:
{
	"_init": module.paths.unshift(nodeRequire("path").join(config.baseUrl, "node_modules")),
	"name": nodeRequire("path").basename(config.baseUrl),
	"out": nodeRequire("path").join("build", nodeRequire("path").basename(config.baseUrl))+(config.suffix||"")+".js",
	"baseUrl": "build",
	"onBuildRead": function (module_name, module_path, content) {
		// This is how a module is built which has dependency modules which use brace_umd. The non-brace_umd module version is used instead when a module is
		// loaded which was a brace_umd built module (it will contain a _umd.js suffix). It is assumed that any module which contains a _umd.js suffix is
		// a brace_umd wrapped module. Note: this should only apply when using a require.resolve as a requirejs paths value.
		return /.+_umd\.js$/.test(module_path) && nodeRequire("fs").existsSync(module_path.replace(/_umd\.js$/, ".js")) &&
				nodeRequire("fs").readFileSync(module_path.replace(/_umd\.js$/, ".js")).toString() || content
	},
	"paths": {
		//"": nodeRequire.resolve("").replace(/\.js\s*$/, "")
	},
	// We do not optimize here so all of the individually built modules will keep their structure.
	"wrap": {
		"start": config.suffix === "_umd" && nodeRequire("brace_umd").wrap_start || "",
		// Add an anonymous definition.
		"end": config.suffix === "_umd" && nodeRequire("brace_umd").wrap_end_option({"auto_anonymous": true}) || ""
	},
	"optimize": "none",
	"keepAmdefine": config.suffix !== "_umd",
	"keepBuildDir": true,
	"writeBuildTxt": false,
}
```

**Below is the complete umd script. The following code will work in nodejs or the browser and can use any of the supported definitions (even copy/pasted into the console to enable quick project experiments):**

```javascript
/* Generated by Brace_Umd 0.8.2 */
!function(e, i, r, t) {
    var define, requirejs, require, umd = {
        e: 'object' == typeof module && 'filename' in module && 'exports' in module,
        requirejs: r,
        define: i,
        i: 'object' == typeof t && t || {},
        r: function() {
            var e = {
                define: !this.i.auto_anonymous && this.define || this.t,
                requirejs: this.requirejs || this.o,
                require: this.requirejs || this.e && module.require || this.factory,
                factory: this.factory
            };
            this.i.force_type in e && (e.requirejs = e.require = e.define = e.factory = e[this.i.force_type]),
            define = e.define, requirejs = e.requirejs, require = e.require;
        },
        n: !1,
        factory: function(i, r, t, o) {
            i && i.constructor === Array ? (o = t, t = r, r = i, i = '') : 'string' != typeof i && (o = r,
            t = i, r = [ 'require' ], i = '');
            var n = [], f = umd.e && module.require || e.require, u = '';
            if (r.every(function(i) {
                return i = i.replace(/^\.[\/,\\]/, ''), n.push('require' === i && f || e[i]), 'require' === i || i in e || (u = i),
                !u;
            }), !0 !== umd.n) {
                if (!i) return umd.n = !0, void (u ? console.log('The amd factory attempted to load the', i || 'anonymous', 'module that specified a dependency which was not defined:', u) : umd.e ? module.exports = t.apply(t.prototype, n) : t.apply(t.prototype, n));
                umd.n = i;
            }
            umd.e ? module.exports[i] = t.apply(t.prototype, n) : e[i] = t.apply(t.prototype, n);
        },
        f: [ 'config', 'nextTick', 'version', 'jsExtRegExp', 'isBrowser', 's', 'toUrl', 'undef', 'defined', 'specified', 'onError', 'createNode', 'load', 'exec' ],
        u: [ 'amd', 'require' ],
        t: function() {
            if (umd.e && !umd.define) try {
                umd.define = module.require('amdefine')(module);
                for (var e in umd.define) umd.t[e] = umd.define[e];
            } catch (e) {}
            var i = umd.define || umd.factory;
            i == umd.define && umd.i.auto_anonymous ? !0 !== umd.n && 'string' == typeof arguments[0] ? umd.n = arguments[0] : 'string' != typeof arguments[0] && (umd.n = !0) : (umd.t = i,
            umd.r()), i.apply(i.prototype, arguments);
        },
        o: function() {
            if (umd.e) try {
                umd.requirejs = module.require('requirejs');
            } catch (e) {}
            umd.o = umd.requirejs || umd.factory, umd.r(), umd.o.apply(umd.o.prototype, arguments);
        }
    };
    for (var o in umd.u) umd.t.__defineGetter__(umd.u[o], function(e) {
        if (umd.e && !umd.define) try {
            umd.define = module.require('amdefine')(module);
            for (var i in umd.define) delete this[i], this[i] = umd.define[i];
            return umd.define[e];
        } catch (e) {}
    }.bind(null, umd.u[o]));
    if (!requirejs) for (var o in umd.f) umd.o.__defineGetter__(umd.f[o], function(e) {
        if (umd.e) try {
            return umd.requirejs = module.require('requirejs'), umd.o = umd.requirejs, umd.r(),
            umd.requirejs[e];
        } catch (e) {
            return;
        }
    }.bind(null, umd.f[o]));
    umd.r()
// -- Add your module definitions here ----------------



// ----------------------------------------------------
umd.n.length && define([ umd.n ], function(e) {
        return e;
   });
}(this, 'function' == typeof define && define || void 0, 'function' == typeof requirejs && requirejs || void 0, {});

```
