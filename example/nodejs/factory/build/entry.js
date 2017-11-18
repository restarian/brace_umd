/* Generated by Brace_UMD 0.6.3 */
!function(_factory, _define, _requirejs, option) {
    var define, requirejs, require, umd = {
        commonjs_available: "object" == typeof module,
        _last_define_id: !1,
        factory: function(id, dependency, callback, error_callback) {
            id && id.constructor === Array ? (error_callback = callback, callback = dependency, 
            dependency = id, id = "") : "string" != typeof id && (id = "", error_callback = dependency = [], 
            callack = id);
            var factory = this.commonjs_available && module.exports || _factory, factory_array = [], remove_path = /^\.[\/,\\]/, was_anony_ma_fied = !1;
            if (!0 !== this._last_define_id) if (id) this._last_define_id = id, was_anony_ma_fied = !1; else {
                if (this._last_define_id = !0, !this.commonjs_available) return !!console.log("The factory definition is being used outside of a commonjs envrionment and the module does not supply an id parameter. Skipping loading of the module. Note: the last module loaded was", this._last_define_id);
                was_anony_ma_fied = !0, factory_array = dependency.map(function(value, index) {
                    return this[value.replace(remove_path, "")];
                }, factory), this.commonjs_available ? module.exports = callback.apply(callback.prototype, factory_array) : _factory = callback.apply(callback.prototype, factory_array);
            }
            !was_anony_ma_fied && dependency.every(function(value) {
                return "require" === (value = value.replace(remove_path, "")) || value in factory || !!console.log("The dependency", value, "is not loaded into the factory. Skipping loading of the module", id);
            }, this) && (factory[id] = callback.apply(callback.prototype, dependency.map(function(value, index) {
                return this[value.replace(remove_path, "")];
            }, factory)));
        },
        requirejs: _requirejs,
        define: _define,
        data: "object" == typeof option && option || {},
        set_global: function() {
            var support = {
                define: !this.data.auto_anonymous && this.define || this.define_proxy.bind(this),
                requirejs: this.requirejs || this.requirejs_proxy.bind(this),
                require: this.requirejs || this.commonjs_available && module.require || this.factory,
                factory: this.factory.bind(this)
            }, force_type = this.data.force_type && this.data.force_type.toString() || "";
            force_type && (!force_type in support ? console.log("The forced type", force_type, "specified as an option is not supported by Brace UMD. Supported types are", Object.keys(support)) : (console.log("Forcing use of the definition type", force_type), 
            support.requirejs = support.require = support.define = support.factory = support[force_type])), 
            define = support.define, requirejs = support.requirejs, require = support.require;
        },
        requirejs_proxy_key: [ "config", "nextTick", "version", "jsExtRegExp", "isBrowser", "s", "toUrl", "undef", "defined", "specified", "onError", "createNode", "load", "exec" ],
        define_proxy_key: [ "amd", "require" ],
        define_proxy: function() {
            if (umd.commonjs_available && !this.define) try {
                this.define = module.require("amdefine")(module);
                for (var p in this.define) this.define_proxy[p] = this.define[p];
            } catch (e) {
                console.log("Unable to find amdefine module.", e.message);
            }
            var use_type = this.define || this.factory.bind(this);
            use_type == this.define ? console.log("Using proxied amdefine definition.") : console.log("Using factory proxied from amdefine call."), 
            use_type == this.define && this.data.auto_anonymous ? !0 !== this._last_define_id && arguments.length > 2 ? this._last_define_id = arguments[0] : arguments.length <= 2 && (this._last_define_id = !0) : (this.define_proxy = use_type, 
            this.set_global()), use_type.apply(use_type.prototype, arguments);
        },
        requirejs_proxy: function() {
            if (this.commonjs_available && !this.requirejs) try {
                this.requirejs = this.module.require("requirejs");
                for (var p in this.requirejs) this.requirejs_proxy[p] = this.requirejs[p];
            } catch (e) {
                console.log("Unable to find requirejs module.", e.message);
            }
            console.log("Using proxied requirejs method.");
            var use_type = this.requirejs || this.factory;
            this.requirejs_proxy = use_type, use_type.apply(use_type.prototype, arguments);
        }
    };
    for (var o in umd.define_proxy_key) umd.define_proxy.__defineGetter__(umd.define_proxy_key[o], function(key) {
        if (this.commonjs_available && !umd.define) try {
            umd.define = module.require("amdefine")(module);
            for (var p in umd.define) delete this[p], this[p] = umd.define[p];
            return console.log("Using proxied amdefine method."), umd.define[key];
        } catch (e) {
            return console.log("Unable to find amdefine module.", e.message);
        }
    }.bind(null, umd.define_proxy_key[o]));
    for (var o in umd.requirejs_proxy_key) umd.requirejs_proxy.__defineGetter__(umd.requirejs_proxy_key[o], function(key) {
        if (this.commonjs_available && !umd.requirejs) try {
            umd.requirejs = module.require("requirejs");
            for (var p in umd.requirejs) delete this[p], this[p] = umd.requirejs[p];
            return console.log("Using proxied requirejs method."), umd.requirejs[p];
        } catch (e) {
            return console.log("Unable to find requirejs module.", e.message);
        }
    }.bind(null, umd.requirejs_proxy_key[o]));
    umd.set_global();
    define("module_one", [], function() {
        var id = "module_one";
        console.log(id + " has initialized.");
        var mod = {};
        mod.id = id;
        return mod;
    });
    define("second_module", [], function() {
        var id = "second_module";
        console.log(id + " has initialized.");
        var mod = {};
        mod.id = id;
        return mod;
    });
    define("entry", [ "module_one", "second_module" ], function(one, two) {
        console.log("entry has initialized.");
        var mod = {};
        mod.id = "entry";
        mod[one.id] = one;
        mod[two.id] = two;
        return mod;
    });
    umd._last_define_id.length && define([ umd._last_define_id ], function(mod) {
        return mod;
    });
}(module.exports, "function" == typeof define && define || void 0, "function" == typeof requirejs && requirejs || void 0, {
    force_type: "factory",
    auto_anonymous: true
});