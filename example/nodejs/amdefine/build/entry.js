/* Generated by Brace_UMD 0.5.0 */
!function(e, o, i, r, n) {
    var t, d, s, f, c, u = {
        e: o,
        o: e,
        requirejs: r,
        define: i,
        i: t || o && o.exports && o.filename || void 0,
        n: d || o && o.exports && o.require("path").dirname(o.filename) || void 0,
        r: n,
        t: {
            requirejs: !0,
            define: !0,
            require: !0,
            factory: !0
        },
        d: [ "config", "nextTick", "version", "jsExtRegExp", "isBrowser", "s", "toUrl", "undef", "defined", "specified", "onError", "createNode", "load", "exec" ],
        s: [ "amd", "require" ],
        f: function() {
            if (u.e && !u.define) try {
                u.define = u.e.require("amdefine")(u.e);
                for (var e in u.define) u.f[e] = u.define[e];
            } catch (e) {
                console.log("Unable to find amdefine module.", e.message);
            }
            var o = u.define || u.factory;
            o == u.define ? console.log("Using proxied amdefine definition.") : console.log("Using factory proxied from amdefine call."), 
            o.apply(o.prototype, arguments);
        },
        c: function() {
            if (u.e && !u.requirejs) try {
                u.requirejs = u.e.require("requirejs");
                for (var e in u.requirejs) u.c[e] = u.requirejs[e];
            } catch (e) {
                console.log("Unable to find requirejs module.", e.message);
            }
            console.log("Using proxied requirejs method.");
            var o = u.requirejs || u.factory;
            o.apply(o.prototype, arguments);
        }
    };
    u.factory = u.o && function(e, o, i, r) {
        if (e && e.constructor === Array && this.e) {
            var n = e, d = dependency;
            r = r, i = i, dependency = n, e = t || "";
        }
        "string" != typeof e ? console.log("The factory Object is being used but the module does not supply an id parameter. Skipping loading of the module.") : o.every(function(o) {
            return o in this.o || !!console.log("The dependency", o, "is not loaded into the factory. Skipping loading of the module", e);
        }, this) && (this.o[e] = i.apply(i.prototype, o.map(function(e, o) {
            return this.o[e];
        }, this)));
    }.bind(u);
    for (var l in u.s) u.f.__defineGetter__(u.s[l], function(e) {
        if (u.e && !u.define) try {
            u.define = u.e.require("amdefine")(u.e);
            for (var o in u.define) delete this[o], this[o] = u.define[o];
            return console.log("Using proxied amdefine method."), u.define[e];
        } catch (e) {
            return console.log("Unable to find amdefine module.", e.message);
        }
    }.bind(null, u.s[l]));
    for (var l in u.d) u.c.__defineGetter__(u.d[l], function(e) {
        if (u.e && !u.requirejs) try {
            u.requirejs = u.e.require("requirejs");
            for (var o in u.requirejs) delete this[o], this[o] = u.requirejs[o];
            return console.log("Using proxied requirejs method."), u.requirejs[o];
        } catch (e) {
            return console.log("Unable to find requirejs module.", e.message);
        }
    }.bind(null, u.d[l]));
    u.r.force_type && (u.r.force_type in u.t ? u[u.r.force_type] ? (console.log("Forcing use of the definition type", u.r.force_type), 
    u.requirejs = u.require = u.define = u.factory = u[u.r.force_type]) : console.log("The forced type", u.r.force_type, "is not available.") : console.log("The forced type", u.r.force_type, "specified as an option is not supported by Brace UMD. Supported types are", Object.keys(u.t))), 
    d = d || u.n, t = t || u.i, f = u.define || u.f, c = u.requirejs || u.c, s = u.e && u.e.require || c;
    f("module_one", [], function() {
        var e = "module_one";
        console.log(e + " has initialized.");
        var o = {};
        o.id = e;
        return o;
    });
    f("second_module", [], function() {
        var e = "second_module";
        console.log(e + " has initialized.");
        var o = {};
        o.id = e;
        return o;
    });
    f("entry", [ "module_one", "second_module" ], function(e, o) {
        var i = "entry";
        console.log(i + " has initialized.");
        var r = {};
        r.id = i;
        r[e.id] = e;
        r[o.id] = o;
        return r;
    });
}(this, "object" == typeof module && module || void 0, "function" == typeof define && define || void 0, "function" == typeof requirejs && requirejs || void 0, {});