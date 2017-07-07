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