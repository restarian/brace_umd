/* Generated by Brace_UMD 0.10.1 */
!function(_factory,_define,_requirejs,option){var define,requirejs,require,umd={commonjs_available:"object"==typeof module&&"filename"in module&&"exports"in module,requirejs:_requirejs,define:_define,data:"object"==typeof option?option:{},set_global:function(){var support={define:!this.data.auto_anonymous&&this.define||this.define_proxy,requirejs:this.requirejs||this.requirejs_proxy,require:this.requirejs||this.commonjs_available&&module.require||this.factory,factory:this.factory};this.data.force_type in support&&(support.requirejs=support.require=support.define=support.factory=support[this.data.force_type]),define=support.define,requirejs=support.requirejs,require=support.require},_last_define_id:!1,factory:function(id,dependency,callback,error_callback){id&&id.constructor===Array?(error_callback=callback,callback=dependency,dependency=id,id=""):"string"!=typeof id&&(error_callback=dependency,callback=id,dependency=["require"],id="");var factory_dep=[],available_require=umd.commonjs_available&&module.require||_factory.require,unmet="";if(dependency.every(function(value){return value=value.replace(/^\.[\/,\\]/,""),factory_dep.push("require"===value&&available_require||_factory[value]),"require"===value||value in _factory||(unmet=value),!unmet}),!0!==umd._last_define_id){if(!id)return umd._last_define_id=!0,void(unmet?console.log("The amd factory attempted to load the",id||"anonymous","module that specified a dependency which was not defined:",unmet):umd.commonjs_available?module.exports=callback.apply(callback.prototype,factory_dep):callback.apply(callback.prototype,factory_dep));umd._last_define_id=id}umd.commonjs_available?module.exports[id]=callback.apply(callback.prototype,factory_dep):_factory[id]=callback.apply(callback.prototype,factory_dep)},requirejs_proxy_key:["config","nextTick","version","jsExtRegExp","isBrowser","s","toUrl","undef","defined","specified","onError","createNode","load","exec"],define_proxy_key:["amd","require"],define_proxy:function(){if(umd.commonjs_available&&!umd.define)try{for(var p in umd.define=module.require("amdefine")(module),umd.define)umd.define_proxy[p]=umd.define[p]}catch(error){}var use_type=umd.define||umd.factory;use_type==umd.define&&umd.data.auto_anonymous?!0!==umd._last_define_id&&"string"==typeof arguments[0]?umd._last_define_id=arguments[0]:"string"!=typeof arguments[0]&&(umd._last_define_id=!0):(umd.define_proxy=use_type,umd.set_global()),use_type.apply(use_type.prototype,arguments)},requirejs_proxy:function(){if(umd.commonjs_available)try{umd.requirejs=module.require("requirejs")}catch(error){}umd.requirejs_proxy=umd.requirejs||umd.factory,umd.set_global(),umd.requirejs_proxy.apply(umd.requirejs_proxy.prototype,arguments)}};for(var o in umd.define_proxy_key)umd.define_proxy.__defineGetter__(umd.define_proxy_key[o],function(key){if(umd.commonjs_available&&!umd.define)try{for(var p in umd.define=module.require("amdefine")(module),umd.define)delete this[p],this[p]=umd.define[p];return umd.define[key]}catch(e){}}.bind(null,umd.define_proxy_key[o]));if(!requirejs)for(var o in umd.requirejs_proxy_key)umd.requirejs_proxy.__defineGetter__(umd.requirejs_proxy_key[o],function(key){if(umd.commonjs_available)try{return umd.requirejs=module.require("requirejs"),umd.requirejs_proxy=umd.requirejs,umd.set_global(),umd.requirejs[key]}catch(e){return}}.bind(null,umd.requirejs_proxy_key[o]));umd.set_global();define("module_one",[],function(){var id="module_one";var mod={};mod.id=id;return mod});define("second_module",[],function(){var id="second_module";var mod={};mod.id=id;return mod});define("entry",["module_one","second_module"],function(one,two){var id="entry";var mod={};mod.id=id;mod[one.id]=one;mod[two.id]=two;return mod});umd._last_define_id.length&&define([umd._last_define_id],function(mod){return mod})}(this,"function"==typeof define&&define||void 0,"function"==typeof requirejs&&requirejs||void 0,{});