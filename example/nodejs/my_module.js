/* Generated by Brace_UMD 0.2.6 */
(function(global_this, global_require, global_requirejs, global_define) {
    /*
    this.__defineGetter__("global_define", function() {
        console.log("Using define");
        return global_define;
    });
    this.__defineGetter__("global_requirejs", function() {
        console.log("Using requirejs");
        return global_define;
    });
    this.__defineGetter__("global_require", function() {
        console.log("Using require");
        return global_require;
    });
    */
    var umd = function() {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        arguments[0].apply(arguments[0].prototype, args);
    };
    var define = function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(global_define || typeof module === "object" && module.exports && global_module || global_this);
        umd.apply(umd.prototype, args);
    };
    var require = function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(global_require || global_this);
        umd.apply(umd.prototype, args);
    };
    var requirejs = function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(global_requirejs || typeof module === "object" && module.exports && global_module || global_this);
        umd.apply(umd.prototype, args);
    };
    var global_module = function(id, dependancy, factory, err_cb) {
        dependancy = dependancy || [];
        module.exports = factory.apply(factory.prototype, dependancy.map(function(value, index) {
            return (global_requirejs || global_require)(value);
        }));
    };
    var global_this = function(id, dependancy, factory, err_cb) {
        if (typeof id !== "string") console.warn("The global native Object needs to be used but the module id parameter is not available."); else if (dependancy.every(function(value, index) {
            return value in global_this || !!console.warn("The dependency", value, "is not loaded into the factory yet. Skipping loading of the module", id);
        })) global_this[id] = factory.apply(factory, dependancy.map(function(value, index) {
            return global_this[value];
        }));
    };

  define("my_mod", ["test_module_one", "test_module_two"], function(one, two) {
    console.log("Init my_module")
    return {one: one, two: two}
  })

})(this, typeof require !== "undefined"&&require||undefined, typeof requirejs !== "undefined"&&requirejs||undefined, typeof define !== "undefined"&&define||undefined)
