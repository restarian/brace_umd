/* Generated by Brace_UMD 0.7.7 */
!function(e,i,t,n){var define,requirejs,require,umd={e:'object'==typeof module&&'filename'in module&&'exports'in module,log:function(){var e=!1;if(umd.e)for(var i in module.children)if(/bracket_print_umd\.js$|bracket_print\.js$/.test(module.children[i].id)){umd.log=module.children[i].exports().log,e=!0;break}return e||(umd.log=console.log.bind(console))||(umd.log=function(){}),umd.log.apply(umd.log.prototype,arguments)},i:!1,factory:function(i,t,n,o){i&&i.constructor===Array?(o=n,n=t,t=i,i=''):'string'!=typeof i&&(o=t,n=i,t=[],i='');var factory=this.e&&module.exports||e,r=[],d=/^\.[\/,\\]/,s=!1;if(!0!==this.i)if(i)this.i=i;else{if(this.i=!0,!this.e)return!!umd.log('The factory definition is being used outside of a commonjs envrionment and the module does not supply an id parameter. Skipping loading of the module. Note: the last module loaded was',this.i);if(!t.every(function(e){return'require'!==(e=e.replace(d,''))&&e in factory||!!umd.log('The dependency',e,'is not loaded into the factory. Skipping loading of the anonymous module')}))return null;s=!0,r=t.map(function(e,i){return this[e.replace(d,'')]},factory),this.e?module.exports=n.apply(n.prototype,r):e=n.apply(n.prototype,r)}!s&&t.every(function(e){return'require'===(e=e.replace(d,''))||e in factory||!!umd.log('The dependency',e,'is not loaded into the factory. Skipping loading of the module',i)})&&(factory[i]=n.apply(n.prototype,t.map(function(e,i){return this[e.replace(d,'')]},factory)))},requirejs:t,define:i,t:'object'==typeof n&&n||{},n:function(){var e={define:!this.t.auto_anonymous&&this.define||this.o,requirejs:this.requirejs||this.r,require:this.requirejs||this.e&&module.require||this.factory.bind(this),factory:this.factory.bind(this)},i=this.t.force_type&&this.t.force_type.toString()||'';i&&(!i in e?umd.log('The forced type',i,'specified as an option is not supported by Brace UMD. Supported types are',Object.keys(e)):(umd.log('Forcing use of the definition type',i),e.requirejs=e.require=e.define=e.factory=e[i])),define=e.define,requirejs=e.requirejs,require=e.require},d:['config','nextTick','version','jsExtRegExp','isBrowser','s','toUrl','undef','defined','specified','onError','createNode','load','exec'],s:['amd','require'],o:function(){if(umd.e&&!umd.define)try{umd.define=module.require('amdefine')(module);for(var e in umd.define)umd.o[e]=umd.define[e]}catch(e){umd.log('Brace UMD is unable to find the amdefine module.',e.message)}var i=umd.define||umd.factory.bind(this);i==umd.define?umd.log('Using proxied amdefine definition.'):umd.log('Using factory proxied from amdefine call.'),i==umd.define&&umd.t.auto_anonymous?!0!==umd.i&&'string'==typeof arguments[0]?umd.i=arguments[0]:'string'!=typeof arguments[0]&&(umd.i=!0):(umd.o=i,umd.n()),i.apply(i.prototype,arguments)},r:function(){if(umd.e)try{umd.requirejs=module.require('requirejs')}catch(e){umd.log('Brace UMD is unable to find the requirejs module.',e.message)}umd.log('Using proxied requirejs method.'),umd.r=umd.requirejs||umd.factory.bind(umd),umd.n(),umd.r.apply(umd.r.prototype,arguments)}};for(var o in umd.s)umd.o.__defineGetter__(umd.s[o],function(e){if(umd.e&&!umd.define)try{umd.define=module.require('amdefine')(module);for(var i in umd.define)delete this[i],this[i]=umd.define[i];return umd.log('Using proxied amdefine method.'),umd.define[e]}catch(e){return umd.log('Brace UMD is unable to find the amdefine module.',e.message)}}.bind(null,umd.s[o]));if(!requirejs)for(var o in umd.d)umd.r.__defineGetter__(umd.d[o],function(e){if(umd.e)try{return umd.requirejs=module.require('requirejs'),umd.log('Using proxied requirejs method to access requirejs.'+e),umd.r=umd.requirejs,umd.n(),umd.requirejs[e]}catch(e){return umd.log('Brace UMD is unable to find the requirejs module.',e.message)}}.bind(null,umd.d[o]));umd.n(),umd.i.length&&define([umd.i],function(e){return e})}(this,'function'==typeof define&&define||void 0,'function'==typeof requirejs&&requirejs||void 0,{});