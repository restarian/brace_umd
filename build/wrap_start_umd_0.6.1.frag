/* Generated by Brace_UMD 0.6.1 */
!function(e,i,o,t){var __filename,__dirname,define,requirejs,require,umd={e:'object'==typeof module,i:!1,filename:'',factory:function(i,o,t,n){i&&i.constructor===Array&&umd.e&&(n=t,t=o,o=i,i=umd.filename),'string'!=typeof i?console.log('The factory Object is being used but the module does not supply an id parameter. Skipping loading of the module.'):o.every(function(o){if('factory'===umd.o.force_type&&!(o in e)||umd.e&&!(o in module)||!(o in e))return o in e||!!console.log('The dependency',o,'is not loaded into the factory. Skipping loading of the module',i)})&&(umd.e?module.exports[i]=t.apply(t.prototype,o.map(function(e,i){return this[e]},e)):e[i]=t.apply(t.prototype,o.map(function(e,i){return this[e]},e)))},requirejs:o,define:i,o:'object'==typeof t&&t||{},t:function(){var e={define:!this.o.auto_anonymous&&this.define||this.n.bind(this),requirejs:this.requirejs||this.r.bind(this),require:this.requirejs||this.e&&module.require||this.factory,factory:this.factory},i=this.o.force_type&&this.o.force_type.toString()||'';i&&(!i in e?console.log('The forced type',i,'specified as an option is not supported by Brace UMD. Supported types are',Object.keys(e)):(console.log('Forcing use of the definition type',i),e.requirejs=e.require=e.define=e.factory=e[i])),define=e.define,requirejs=e.requirejs,require=e.require},s:['config','nextTick','version','jsExtRegExp','isBrowser','s','toUrl','undef','defined','specified','onError','createNode','load','exec'],d:['amd','require'],n:function(){if(umd.e&&!this.define)try{this.define=module.require('amdefine')(module);for(var e in this.define)this.n[e]=this.define[e]}catch(e){console.log('Unable to find amdefine module.',e.message)}var i=this.define||this.factory.bind(this);i==this.define?console.log('Using proxied amdefine definition.'):console.log('Using factory proxied from amdefine call.'),i==this.define&&this.o.auto_anonymous?!0!==this.i&&arguments.length>2?this.i=arguments[0]:arguments.length<=2&&(this.i=!0):(this.n=i,this.t()),i.apply(i.prototype,arguments)},r:function(){if(commonjs_available&&!this.requirejs)try{this.requirejs=this.f.require('requirejs');for(var e in this.requirejs)this.r[e]=this.requirejs[e]}catch(e){console.log('Unable to find requirejs module.',e.message)}console.log('Using proxied requirejs method.');var i=this.requirejs||this.factory;this.r=i,i.apply(i.prototype,arguments)}};for(var n in umd.d)umd.n.__defineGetter__(umd.d[n],function(e){if(commonjs_available&&!umd.define)try{umd.define=module.require('amdefine')(module);for(var i in umd.define)delete this[i],this[i]=umd.define[i];return console.log('Using proxied amdefine method.'),umd.define[e]}catch(e){return console.log('Unable to find amdefine module.',e.message)}}.bind(null,umd.d[n]));for(var n in umd.s)umd.r.__defineGetter__(umd.s[n],function(e){if(commonjs_available&&!umd.requirejs)try{umd.requirejs=module.require('requirejs');for(var i in umd.requirejs)delete this[i],this[i]=umd.requirejs[i];return console.log('Using proxied requirejs method.'),umd.requirejs[i]}catch(e){return console.log('Unable to find requirejs module.',e.message)}}.bind(null,umd.s[n]));__filename=umd.e&&module.filename||'',__dirname=umd.e&&module.require('path').dirname(__filename)||'',umd.t(),umd.e&&(umd.filename=module.require('path').basename(__filename));