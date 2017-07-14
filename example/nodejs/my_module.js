(function(e) {
    var o = define || void 0, t = requirejs || void 0, n = require || void 0;
    this.__defineGetter__("global_define", function() {
        console.log("Using define");
        return o;
    });
    this.__defineGetter__("global_requirejs", function() {
        console.log("Using requirejs");
        return o;
    });
    this.__defineGetter__("global_require", function() {
        console.log("Using require");
        return n;
    });
    var r = function() {
        var e = Array.prototype.slice.call(arguments);
        e.shift();
        arguments[0].apply(arguments[0].prototype, e);
    }, define = function() {
        var t = Array.prototype.slice.call(arguments);
        t.unshift(o || "object" == typeof module && module.exports && i || e);
        r.apply(r.prototype, t);
    }, require = function() {
        var o = Array.prototype.slice.call(arguments);
        o.unshift(n || e);
        r.apply(r.prototype, o);
    }, requirejs = function() {
        var o = Array.prototype.slice.call(arguments);
        o.unshift(t || "object" == typeof module && module.exports && i || e);
        r.apply(r.prototype, o);
    }, i = function(e, o, r, i) {
        o = o || [];
        module.exports = r.apply(r.prototype, o.map(function(e, o) {
            return (t || n)(e);
        }));
    }, e = function(o, t, n, r) {
        "string" != typeof o ? console.warn("The global native Object needs to be used but the module id parameter is not available.") : t.every(function(t, n) {
            return t in e || !!console.warn("The dependency", t, "is not loaded into the factory yet. Skipping loading of the module", o);
        }) && (e[o] = n.apply(n, t.map(function(o, t) {
            return e[o];
        })));
    };

    console.log("here")
    define("my_mod", [], function() {
      console.log("module init")
      return {"id": "my_mod"}
    })

})(this)
