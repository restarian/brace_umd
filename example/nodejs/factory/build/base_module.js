/* Generated by Brace_UMD 0.3.2 */
!function(e, o, r, i, n, t, s) {
    s = s || {};
    var d, f, c, u = {
        requirejs: n,
        define: i,
        e: e,
        o: e && e.exports || t,
        i: [ "requirejs", "define", "require", "factory" ],
        force_type: s.force_type,
        n: [ "config", "nextTick", "version", "jsExtRegExp", "isBrowser", "s", "toUrl", "undef", "defined", "specified", "onError", "createNode", "load", "exec" ],
        r: [ "amd", "require" ],
        t: function() {
            if (u.e && !u.define) try {
                u.define = u.e.require("amdefine")(u.e);
                for (var e in u.define) u.t[e] = u.define[e];
            } catch (e) {
                console.log(e.message);
            }
            var o = u.define || u.factory;
            o == u.define ? console.log("Using proxied amdefine definition.") : console.log("Using factory proxied from amdefine call."), 
            o.apply(o.prototype, arguments);
        },
        s: function() {
            if (u.e && !u.requirejs) try {
                u.requirejs = u.e.require("requirejs");
                for (var e in u.requirejs) u.s[e] = u.requirejs[e];
            } catch (e) {
                console.log(e.message);
            }
            console.log("Using proxied requirejs method.");
            var o = u.requirejs || u.factory;
            o.apply(o.prototype, arguments);
        }
    };
    for (var a in u.r) u.t.__defineGetter__(u.r[a], function(e) {
        if (u.e && !u.define) try {
            u.define = u.e.require("amdefine")(u.e);
            for (var o in u.define) delete this[o], this[o] = u.define[o];
            return console.log("Using proxied amdefine method."), u.define[e];
        } catch (e) {
            return console.log(e.message);
        }
    }.bind(null, u.r[a]));
    for (var a in u.n) u.s.__defineGetter__(u.n[a], function(e) {
        if (u.e && !u.requirejs) try {
            u.requirejs = u.e.require("requirejs");
            for (var o in u.requirejs) delete this[o], this[o] = u.requirejs[o];
            return console.log("Using proxied requirejs method."), u.requirejs[o];
        } catch (e) {
            return console.log(e.message);
        }
    }.bind(null, u.n[a]));
    u.factory = u.o && function(e, o, r, i) {
        if (e && e.constructor === Array && this.e) {
            var n = e, t = dependency;
            i = i, r = r, dependency = n, e = this.e.d || "";
        }
        "string" != typeof e ? console.log("The factory Object is being used but the module does not supply an id parameter. Skipping loading of the module.") : o.every(function(o) {
            return o in this.o || !!console.log("The dependency", o, "is not loaded into the factory. Skipping loading of the module", e);
        }, this) && (this.o[e] = r.apply(r.prototype, o.map(function(e, o) {
            return this.o[e];
        }, this)));
    }.bind(u), u.force_type && (new RegExp(u.force_type + ",+").test(u.i.join(",") + ",") ? u[u.force_type] ? (console.log("Forcing use of the definition type", u.force_type), 
    u.requirejs = u.require = u.define = u.factory = u[u.force_type]) : console.log("The forced type", u.force_type, "is not available.") : console.log("The force_type", u.force_type, "specified as an option is not supported by Brace UMD. Supported types are:", u.i.join(", "))), 
    f = u.define || u.t, c = u.requirejs || u.s, d = u.e && u.e.require || c;
    f("second_module", [], function() {
        var e = "second_module";
        console.log(e + " has initialized.");
        var o = {};
        o.id = e;
        return o;
    });
    f("base_module", [ "second_module" ], function(e) {
        var o = "base_module";
        console.log(o + " has initialized.");
        var r = {};
        r.id = o;
        r[e.id] = e;
        return r;
    });
}("object" == typeof module && module.exports && module || void 0, "string" == typeof __filename && __filename || "", "string" == typeof __dirname && __dirname || "", "function" == typeof define && define || void 0, "function" == typeof requirejs && requirejs || void 0, this, {
    force_type: "factordy"
});