/* Generated by Brace_UMD 0.2.6 */
(function(o) {
    var t = define || void 0, e = requirejs || void 0, p = require || void 0, n = function() {
        var o = Array.prototype.slice.call(arguments);
        o.shift();
        arguments[0].apply(arguments[0].prototype, o);
    }, define = function() {
        var e = Array.prototype.slice.call(arguments);
        e.unshift(t || "object" == typeof module && module.exports && r || o);
        n.apply(n.prototype, e);
    }, require = function() {
        var t = Array.prototype.slice.call(arguments);
        t.unshift(p || o);
        n.apply(n.prototype, t);
    }, requirejs = function() {
        var t = Array.prototype.slice.call(arguments);
        t.unshift(e || "object" == typeof module && module.exports && r || o);
        n.apply(n.prototype, t);
    }, r = function(o, t, n, r) {
        t = t || [];
        module.exports = n.apply(n.prototype, t.map(function(o, t) {
            return (e || p)(o);
        }));
    }, o = function(t, e, p, n) {
        "string" != typeof t ? console.warn("The global native Object needs to be used but the module id parameter is not available.") : e.every(function(e, p) {
            return e in o || !!console.warn("The dependency", e, "is not loaded into the factory yet. Skipping loading of the module", t);
        }) && (o[t] = p.apply(p, e.map(function(t, e) {
            return o[t];
        })));
    };
