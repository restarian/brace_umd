// This is the only call the load the amdefine module that is needed. All the others will be wrapped with brace_umd by the r.js optimizer.
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([], function(mod) {

  console.log(this)
  console.log(mod)
})
