/* Generated by Brace_UMD 0.8.5 */
!function(e,i,r,t){var define,requirejs,require,umd={e:'object'==typeof module&&'filename'in module&&'exports'in module,requirejs:r,define:i,i:'object'==typeof t&&t||{},r:function(){var e={define:!this.i.auto_anonymous&&this.define||this.t,requirejs:this.requirejs||this.o,require:this.requirejs||this.e&&module.require||this.factory,factory:this.factory};this.i.force_type in e&&(e.requirejs=e.require=e.define=e.factory=e[this.i.force_type]),define=e.define,requirejs=e.requirejs,require=e.require},n:!1,factory:function(i,r,t,o){i&&i.constructor===Array?(o=t,t=r,r=i,i=''):'string'!=typeof i&&(o=r,t=i,r=['require'],i='');var n=[],f=umd.e&&module.require||e.require,u='';if(r.every(function(i){return i=i.replace(/^\.[\/,\\]/,''),n.push('require'===i&&f||e[i]),'require'===i||i in e||(u=i),!u}),!0!==umd.n){if(!i)return umd.n=!0,void(u?console.log('The amd factory attempted to load the',i||'anonymous','module that specified a dependency which was not defined:',u):umd.e?module.exports=t.apply(t.prototype,n):t.apply(t.prototype,n));umd.n=i}umd.e?module.exports[i]=t.apply(t.prototype,n):e[i]=t.apply(t.prototype,n)},f:['config','nextTick','version','jsExtRegExp','isBrowser','s','toUrl','undef','defined','specified','onError','createNode','load','exec'],u:['amd','require'],t:function(){if(umd.e&&!umd.define)try{umd.define=module.require('amdefine')(module);for(var e in umd.define)umd.t[e]=umd.define[e]}catch(e){}var i=umd.define||umd.factory;i==umd.define&&umd.i.auto_anonymous?!0!==umd.n&&'string'==typeof arguments[0]?umd.n=arguments[0]:'string'!=typeof arguments[0]&&(umd.n=!0):(umd.t=i,umd.r()),i.apply(i.prototype,arguments)},o:function(){if(umd.e)try{umd.requirejs=module.require('requirejs')}catch(e){}umd.o=umd.requirejs||umd.factory,umd.r(),umd.o.apply(umd.o.prototype,arguments)}};for(var o in umd.u)umd.t.__defineGetter__(umd.u[o],function(e){if(umd.e&&!umd.define)try{umd.define=module.require('amdefine')(module);for(var i in umd.define)delete this[i],this[i]=umd.define[i];return umd.define[e]}catch(e){}}.bind(null,umd.u[o]));if(!requirejs)for(var o in umd.f)umd.o.__defineGetter__(umd.f[o],function(e){if(umd.e)try{return umd.requirejs=module.require('requirejs'),umd.o=umd.requirejs,umd.r(),umd.requirejs[e]}catch(e){return}}.bind(null,umd.f[o]));umd.r(),umd.n.length&&define([umd.n],function(e){return e})}(this,'function'==typeof define&&define||void 0,'function'==typeof requirejs&&requirejs||void 0,{});