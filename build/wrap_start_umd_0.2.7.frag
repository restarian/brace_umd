/* Generated by Brace_UMD 0.2.7 */
(function() {
    var e = {
        requirejs: typeof requirejs !== "undefined" && requirejs || undefined,
        define: typeof define !== "undefined" && define || undefined,
        require: typeof require !== "undefined" && require || typeof module !== "undefined" && module.require.bind(module) || undefined,
        support: {
            require: true,
            requirejs: true,
            define: true
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
            var i = e, n = o, p = t, u = r;
            r = p;
            t = n;
            o = i;
            e = module.filenmame;
        }
        if (typeof e !== "string") console.log("The global native Object is attempted to be used but the module does not supply an id parameter. Skipping loading of the module."); else if (o.every(function(o, t) {
            return o in this.factory || !!console.log("The dependency", o, "is not loaded into the factory yet. Skipping loading of the module", e);
        }, this)) this.factory[e] = t.apply(t, o.map(function(e, o) {
            return this.factory[e];
        }, this));
    }.bind(e);
    e.commonjs = function(e, o, t, r) {
        if (e && e.constructor === Array) {
            var i = e, n = o, p = t, u = r;
            r = p;
            t = n;
            o = i;
        }
        module.exports = t.apply(t.prototype, o.map(function(e, o) {
            return this.require(e);
        }, this));
    }.bind(e);
    if (e.force_type) if (!(e.force_type in e.support)) {
        console.log("The forced type", e.force_type, "specified as an option is not supported by Brace UMD. Supported types are", Object.keys(e.support));
    } else if (!e[e.force_type]) {
        console.log("The forced type", e.force_type, "is not available.");
    } else {
        e.requirejs = e.require = e.define = e.factory = e[e.force_type];
    }
    var define = function() {
        var o = Array.prototype.slice.call(arguments);
        o.unshift(e.define || typeof module === "object" && module.exports && e.commonjs || e.global_object);
        e.use.apply(e.use.prototype, o);
    };
    var require = function() {
        var o = Array.prototype.slice.call(arguments);
        o.unshift(e.require || global_object);
        e.use.apply(e.use.prototype, o);
    };
    var requirejs = function() {
        var o = Array.prototype.slice.call(arguments);
        o.unshift(e.requirejs || typeof module === "object" && module.exports && e.commonjs || e.global_object);
        e.use.apply(e.use.prototype, o);
    };
    define("dds", [ "test_module_two" ], function(e, o) {
        console.log("Init my_module");
        return {
            one: e,
            two: o
        };
    });
}(this, {
    force_type: "requirejs"
}