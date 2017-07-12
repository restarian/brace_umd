!function(global_this) {
    var global_define = define || void 0, global_requirejs = requirejs || void 0, global_require = require || void 0, define = function() {
        Array.prototype.slice.call(arguments).unshift(global_define || "object" == typeof module && module.exports && global_module || global_this);
    }, require = function() {
        Array.prototype.slice.call(arguments).unshift(global_require || global_this);
    }, requirejs = function() {
        Array.prototype.slice.call(arguments).unshift(global_requirejs || "object" == typeof module && module.exports && global_module || global_this);
    }, global_module = function(id, deps, factory, err_cb) {
        deps = deps || [], module.exports = factory.apply(factory.prototype, deps.map(function(value, index) {
            return (global_requirejs || global_require)(value);
        }));
    }, global_this = function(id, deps, factory, err_cb) {
        "string" != typeof id ? console.warn("The global native Object needs to be used but the module id parameter is not available.") : deps.every(function(value, index) {
            return value in global_global || !!console.warn("The dependency", value, "is not loaded into the factory yet. Skipping loading of the module", id);
        }) && (global_global[id] = factory.apply(factory, deps.map(function(value, index) {
            return global_global[value];
        })));
    }, umd = function() {
        var args = Array.prototype.slice.call(arguments);
        args.shift(), arguments[0].apply(arguments[0].prototype, args);
    };
    define("another_module", [ "another_module" ], function(a) {
        console.log("module init");
        return {
            cool: "joes"
        };
    });
    define("example_module", [ "another_module" ], function(a) {
        console.log("odule init");
        return {
            cool: "joes"
        };
    });
}(this);