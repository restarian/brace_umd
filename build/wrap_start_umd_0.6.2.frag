/* Generated by Brace_UMD 0.6.2 */
!function(e,i,t,o){var __filename,__dirname,define,requirejs,require,umd={e:'object'==typeof module,i:!1,filename:'',factory:function(i,t,o,s){i&&i.constructor===Array&&this.e&&(s=o,o=t,t=i,i=this.filename),'string'!=typeof i?console.log('The factory Object is being used but the module does not supply an id parameter. Skipping loading of the module.'):t.every(function(t){return'require'===t||(t=t.replace(/^\.[\/,\\]/,''),('factory'!==this.t.force_type||t in e)&&(!this.e||t in module.exports)&&t in e||!!console.log('The dependency',t,'is not loaded into the factory. Skipping loading of the module',i))},this)&&(this.e?module.exports[i]=o.apply(o.prototype,t.map(function(e,i){return this[e.replace(/^\.[\/,\\]/,'')]},module.exports)):e[i]=o.apply(o.prototype,t.map(function(e,i){return this[e.replace(/^\.[\/,\\]/,'')]},e)))},requirejs:t,define:i,t:'object'==typeof o&&o||{},o:function(){var e={define:!this.t.auto_anonymous&&this.define||this.s.bind(this),requirejs:this.requirejs||this.n.bind(this),require:this.requirejs||this.e&&module.require||this.factory.bind(this),factory:this.factory.bind(this)},i=this.t.force_type&&this.t.force_type.toString()||'';i&&(!i in e?console.log('The forced type',i,'specified as an option is not supported by Brace UMD. Supported types are',Object.keys(e)):(console.log('Forcing use of the definition type',i),e.requirejs=e.require=e.define=e.factory=e[i])),define=e.define,requirejs=e.requirejs,require=e.require},get s(){if(this.e&&!this.define)try{this.define=module.require('amdefine')(module)}catch(e){console.log('Unable to find amdefine module.',e.message)}var e=this.define||this.factory.bind(this);return e==this.define?console.log('Using proxied amdefine definition.'):console.log('Using factory proxied from amdefine call.'),e==this.define&&this.t.auto_anonymous?function(){return!0!==this.i&&arguments.length>2?this.i=arguments[0]:arguments.length<=2&&(this.i=!0),e.apply(e.prototype,arguments)}.bind(this):(Object.defineProperty(this,'define_proxy',{r:!0,h:!0,u:!0,d:e}),this.o(),e)},get n(){if(this.e&&!this.requirejs)try{this.requirejs=module.require('requirejs')}catch(e){console.log('Brace UMD is unable to find requirejs module.',e.message)}var e=this.requirejs||this.factory.bind(this);return e==this.requirejs?console.log('Using proxied requirejs definition.'):console.log('Using factory proxied from requirejs call.'),e!=this.requirejs&&(Object.defineProperty(this,'requirejs_proxy',{r:!0,h:!0,u:!0,d:e}),this.o()),e}};__filename=umd.e&&module.filename||'',__dirname=umd.e&&module.require('path').dirname(__filename)||'',umd.o(),umd.e&&(umd.filename=module.require('path').basename(__filename));