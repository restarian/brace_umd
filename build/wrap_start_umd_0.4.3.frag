/* Generated by Brace_UMD 0.4.3 */
!function(e, o, i, n, r) {
    var __filename, __dirname, require, define, requirejs, t = {
        e: e,
        requirejs: n,
        define: i,
        o: __filename || o && o.exports && o.filename || void 0,
        i: __dirname || o && o.exports && o.require('path').dirname(o.filename) || void 0,
        n: {},
        r: {
            requirejs: !0,
            define: !0,
            require: !0,
            factory: !0
        },
        t: [ 'config', 'nextTick', 'version', 'jsExtRegExp', 'isBrowser', 's', 'toUrl', 'undef', 'defined', 'specified', 'onError', 'createNode', 'load', 'exec' ],
        d: [ 'amd', 'require' ],
        s: function() {
            if (t.f && !t.define) try {
                t.define = t.f.require('amdefine')(t.f);
                for (var e in t.define) t.s[e] = t.define[e];
            } catch (e) {
                console.log(e.message);
            }
            var o = t.define || t.factory;
            o == t.define ? console.log('Using proxied amdefine definition.') : console.log('Using factory proxied from amdefine call.'), 
            o.apply(o.prototype, arguments);
        },
        c: function() {
            if (t.f && !t.requirejs) try {
                t.requirejs = t.f.require('requirejs');
                for (var e in t.requirejs) t.c[e] = t.requirejs[e];
            } catch (e) {
                console.log(e.message);
            }
            console.log('Using proxied requirejs method.');
            var o = t.requirejs || t.factory;
            o.apply(o.prototype, arguments);
        }
    };
    t.factory = t.e && function(e, o, i, n) {
        if (e && e.constructor === Array && this.f) {
            var r = e, t = dependency;
            n = n, i = i, dependency = r, e = __filename || '';
        }
        'string' != typeof e ? console.log('The factory Object is being used but the module does not supply an id parameter. Skipping loading of the module.') : o.every(function(o) {
            return o in this.e || !!console.log('The dependency', o, 'is not loaded into the factory. Skipping loading of the module', e);
        }, this) && (this.e[e] = i.apply(i.prototype, o.map(function(e, o) {
            return this.e[e];
        }, this)));
    }.bind(t);
    for (var d in t.d) t.s.__defineGetter__(t.d[d], function(e) {
        if (t.f && !t.define) try {
            t.define = t.f.require('amdefine')(t.f);
            for (var o in t.define) delete this[o], this[o] = t.define[o];
            return console.log('Using proxied amdefine method.'), t.define[e];
        } catch (e) {
            return console.log(e.message);
        }
    }.bind(null, t.d[d]));
    for (var d in t.t) t.c.__defineGetter__(t.t[d], function(e) {
        if (t.f && !t.requirejs) try {
            t.requirejs = t.f.require('requirejs');
            for (var o in t.requirejs) delete this[o], this[o] = t.requirejs[o];
            return console.log('Using proxied requirejs method.'), t.requirejs[o];
        } catch (e) {
            return console.log(e.message);
        }
    }.bind(null, t.t[d]));
    t.n.force_type && (t.n.force_type in t.r ? t[t.n.force_type] ? (console.log('Forcing use of the definition type', t.n.force_type), 
    t.requirejs = t.require = t.define = t.factory = t[t.n.force_type]) : console.log('The forced type', t.n.force_type, 'is not available.') : console.log('The forced type', t.n.force_type, 'specified as an option is not supported by Brace UMD. Supported types are', Object.keys(t.r))), 
    __dirname = __dirname || t.i, __filename = __filename || t.o, define = t.define || t.s, 
    requirejs = t.requirejs || t.c, require = t.f && t.f.require || requirejs;
;