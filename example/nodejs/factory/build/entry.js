/* Generated by Brace_UMD 0.5.4 */
!function(e, i, o, n) {
    var r, t, s, d, u, f = {
        e: "object" == typeof module,
        i: !1,
        factory: function(i, o, n, t) {
            if (i && i.constructor === Array && this.o) {
                var s = i, d = dependency;
                t = t, n = n, dependency = s, i = r || "";
            }
            "string" != typeof i ? console.log("The factory Object is being used but the module does not supply an id parameter. Skipping loading of the module.") : o.every(function(o) {
                return o in e || !!console.log("The dependency", o, "is not loaded into the factory. Skipping loading of the module", i);
            }, this) && (e[i] = n.apply(n.prototype, o.map(function(e, i) {
                return this[e];
            }, e)));
        },
        requirejs: o,
        define: i,
        t: "object" == typeof n && n || {},
        n: function() {
            var e = {
                define: !this.t.auto_anonymous && this.define || this.s.bind(this),
                requirejs: this.requirejs || this.r.bind(this),
                require: this.requirejs || this.e && module.require || this.factory.bind(this),
                factory: this.factory
            }, i = this.t.force_type && this.t.force_type.toString() || "";
            i && (!i in e ? console.log("The forced type", i, "specified as an option is not supported by Brace UMD. Supported types are", Object.keys(e)) : (console.log("Forcing use of the definition type", i), 
            e.requirejs = e.require = e.define = e.factory = e[i])), s = e.define, d = e.requirejs, 
            u = e.require;
        },
        d: [ "config", "nextTick", "version", "jsExtRegExp", "isBrowser", "s", "toUrl", "undef", "defined", "specified", "onError", "createNode", "load", "exec" ],
        h: [ "amd", "require" ],
        s: function() {
            if (f.e && !this.define) try {
                this.define = module.require("amdefine")(module);
                for (var e in this.define) this.s[e] = this.define[e];
            } catch (e) {
                console.log("Unable to find amdefine module.", e.message);
            }
            var i = this.define || this.factory.bind(this);
            i == this.define ? console.log("Using proxied amdefine definition.") : console.log("Using factory proxied from amdefine call."), 
            i == this.define && this.t.auto_anonymous ? !0 !== this.i && arguments.length > 2 ? this.i = arguments[0] : arguments.length <= 2 && (this.i = !0) : (this.s = i, 
            this.n()), i.apply(i.prototype, arguments);
        },
        r: function() {
            if (commonjs_available && !this.requirejs) try {
                this.requirejs = this.o.require("requirejs");
                for (var e in this.requirejs) this.r[e] = this.requirejs[e];
            } catch (e) {
                console.log("Unable to find requirejs module.", e.message);
            }
            console.log("Using proxied requirejs method.");
            var i = this.requirejs || this.factory.bind(this);
            this.r = i, i.apply(i.prototype, arguments);
        }
    };
    for (var a in f.h) f.s.__defineGetter__(f.h[a], function(e) {
        if (commonjs_available && !f.define) try {
            f.define = module.require("amdefine")(module);
            for (var i in f.define) delete this[i], this[i] = f.define[i];
            return console.log("Using proxied amdefine method."), f.define[e];
        } catch (e) {
            return console.log("Unable to find amdefine module.", e.message);
        }
    }.bind(null, f.h[a]));
    for (var a in f.d) f.r.__defineGetter__(f.d[a], function(e) {
        if (commonjs_available && !f.requirejs) try {
            f.requirejs = module.require("requirejs");
            for (var i in f.requirejs) delete this[i], this[i] = f.requirejs[i];
            return console.log("Using proxied requirejs method."), f.requirejs[i];
        } catch (e) {
            return console.log("Unable to find requirejs module.", e.message);
        }
    }.bind(null, f.d[a]));
    r = this.e && module.filename || void 0, t = this.e && module.require("path").dirname(r) || void 0, 
    f.n();
    s("module_one", [], function() {
        var e = "module_one";
        console.log(e + " has initialized.");
        var i = {};
        i.id = e;
        return i;
    });
    s("second_module", [], function() {
        var e = "second_module";
        console.log(e + " has initialized.");
        var i = {};
        i.id = e;
        return i;
    });
    s("entry", [ "module_one", "second_module" ], function(e, i) {
        var o = "entry";
        console.log(o + " has initialized.");
        var n = {};
        n.id = o;
        n[e.id] = e;
        n[i.id] = i;
        return n;
    });
    f.i.length && s([ f.i ], function(e) {
        return e;
    });
}(this, "function" == typeof define && define || void 0, "function" == typeof requirejs && requirejs || void 0, {
    force_type: "factory"
});