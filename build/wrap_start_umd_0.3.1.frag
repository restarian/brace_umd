/* Generated by Brace_UMD 0.3.1 */
!function(fac, def, reqjs) {
    var umd = {
        requirejs: reqjs,
        define: def,
        module: module,
        _factory: fac,
        support: {
            requirejs: !0,
            define: !0,
            require: !0,
            factory: !0
        },
        force_type: arguments[0] && arguments[0].force_type || arguments[1] && arguments[1].force_type,
        requirejs_proxy_key: [ "config", "nextTick", "version", "jsExtRegExp", "isBrowser", "s", "toUrl", "undef", "defined", "specified", "onError", "createNode", "load", "exec" ],
        define_proxy_key: [ "amd", "require" ],
        define_proxy: function() {
            if (umd.module && !umd.define) try {
                umd.define = umd.module.require("amdefine")(umd.module);
                for (var p in umd.define) umd.define_proxy[p] = umd.define[p];
            } catch (e) {
                console.log(e.message);
            }
            console.log("Using proxied amdefine method. This can be ovioded but defining a global requriejs property prior to initializing this script.");
            var use_type = umd.define || umd.factory;
            use_type.apply(use_type.prototype, arguments);
        },
        requirejs_proxy: function() {
            if (umd.module && !umd.requirejs) try {
                umd.requirejs = umd.module.require("requirejs");
                for (var p in umd.requirejs) umd.requirejs_proxy[p] = umd.requirejs[p];
            } catch (e) {
                console.log(e.message);
            }
            console.log("Using proxied requriejs method. This can be ovioded but defining a global define property prior to initializing this script.");
            var use_type = umd.requirejs || umd.factory;
            use_type.apply(use_type.prototype, arguments);
        }
    };
    for (var o in umd.define_proxy_key) umd.define_proxy.__defineGetter__(umd.define_proxy_key[o], function(key) {
        if (umd.module && !umd.define) try {
            umd.define = umd.module.require("amdefine")(umd.module);
            for (var p in umd.define) delete this[p], this[p] = umd.define[p];
            return console.log("Using proxied amdefine method. This can be ovioded but defining a global define property prior to initializing this script."), 
            umd.define[key];
        } catch (e) {
            return void console.log(e.message);
        }
    }.bind(null, umd.define_proxy_key[o]));
    for (var o in umd.requirejs_proxy_key) umd.requirejs_proxy.__defineGetter__(umd.requirejs_proxy_key[o], function(key) {
        if (umd.module && !umd.requirejs) try {
            umd.requirejs = umd.module.require("requirejs");
            for (var p in umd.requirejs) delete this[p], this[p] = umd.requirejs[p];
            console.log("Using proxied requirejs method. This can be ovioded but defining a global requirejs property prior to initializing this script.");
        } catch (e) {
            return void console.log(e.message);
        }
    }.bind(null, umd.requirejs_proxy_key[o]));
    umd.factory = umd._factory && function(id, dependancy, callback, error_callback) {
        if (id && id.constructor === Array && this.module) {
            var i = id;
            dependency;
            error_callback = error_callback, callback = callback, dependency = i, id = this.module.filenmame;
        }
        "string" != typeof id ? console.log("The global native Object is attempted to be used but the module does not supply an id parameter. Skipping loading of the module.") : dependancy.every(function(value, index) {
            return value in this._factory || !!console.log("The dependency", value, "is not loaded into the factory yet. Skipping loading of the module", id);
        }, this) && (this._factory[id] = callback.apply(callback.prototype, dependancy.map(function(value, index) {
            return this._factory[value];
        }, this)));
    }.bind(umd), umd.force_type && (umd.force_type in umd.support ? umd[umd.force_type] ? (console.log("Forcing use of the definition type", umd.force_type), 
    umd.requirejs = umd.require = umd.define = umd.factory = umd[umd.force_type]) : console.log("The forced type", umd.force_type, "is not available.") : console.log("The forced type", umd.force_type, "specified as an option is not supported by Brace UMD. Supported types are", Object.keys(umd.support))), 
    umd.define || umd.define_proxy, requirejs = umd.requirejs || umd.requirejs_proxy, 
    umd.module && umd.module.require || requirejs;
;