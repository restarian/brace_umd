/* Generated by Brace_UMD 0.10.0 */
!function(u,e,i,r){var define,requirejs,require,umd={e:'object'==typeof module&&'filename'in module&&'exports'in module,requirejs:i,define:e,i:'object'==typeof r?r:{},r:function(){var e={define:!this.i.auto_anonymous&&this.define||this.t,requirejs:this.requirejs||this.o,require:this.requirejs||this.e&&module.require||this.factory,factory:this.factory};this.i.force_type in e&&(e.requirejs=e.require=e.define=e.factory=e[this.i.force_type]),define=e.define,requirejs=e.requirejs,require=e.require},n:!1,factory:function(e,i,r,t){e&&e.constructor===Array?(t=r,r=i,i=e,e=''):'string'!=typeof e&&(t=i,r=e,i=['require'],e='');var o=[],n=umd.e&&module.require||u.require,f='';if(i.every(function(e){return e=e.replace(/^\.[\/,\\]/,''),o.push('require'===e&&n||u[e]),'require'===e||e in u||(f=e),!f}),!0!==umd.n){if(!e)return umd.n=!0,void(f?console.log('The amd factory attempted to load the',e||'anonymous','module that specified a dependency which was not defined:',f):umd.e?module.exports=r.apply(r.prototype,o):r.apply(r.prototype,o));umd.n=e}umd.e?module.exports[e]=r.apply(r.prototype,o):u[e]=r.apply(r.prototype,o)},f:['config','nextTick','version','jsExtRegExp','isBrowser','s','toUrl','undef','defined','specified','onError','createNode','load','exec'],u:['amd','require'],t:function(){if(umd.e&&!umd.define)try{for(var e in umd.define=module.require('amdefine')(module),umd.define)umd.t[e]=umd.define[e]}catch(e){}var i=umd.define||umd.factory;i==umd.define&&umd.i.auto_anonymous?!0!==umd.n&&'string'==typeof arguments[0]?umd.n=arguments[0]:'string'!=typeof arguments[0]&&(umd.n=!0):(umd.t=i,umd.r()),i.apply(i.prototype,arguments)},o:function(){if(umd.e)try{umd.requirejs=module.require('requirejs')}catch(e){}umd.o=umd.requirejs||umd.factory,umd.r(),umd.o.apply(umd.o.prototype,arguments)}};for(var t in umd.u)umd.t.__defineGetter__(umd.u[t],function(e){if(umd.e&&!umd.define)try{for(var i in umd.define=module.require('amdefine')(module),umd.define)delete this[i],this[i]=umd.define[i];return umd.define[e]}catch(e){}}.bind(null,umd.u[t]));if(!requirejs)for(var t in umd.f)umd.o.__defineGetter__(umd.f[t],function(e){if(umd.e)try{return umd.requirejs=module.require('requirejs'),umd.o=umd.requirejs,umd.r(),umd.requirejs[e]}catch(e){return}}.bind(null,umd.f[t]));umd.r(),umd.n.length&&define([umd.n],function(e){return e})}(this,'function'==typeof define&&define||void 0,'function'==typeof requirejs&&requirejs||void 0,{});