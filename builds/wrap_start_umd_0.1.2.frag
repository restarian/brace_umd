(function(e,n,o,t){3===arguments.length&&(t=o,o=n,n=void 0,arguments[4]=t,arguments.length=arguments.length+1),"function"==typeof define&&define.amd?(console.log("Using amdefine to define the module",n||""),arguments.length>=4?define(n,o,t):define(o,t)):"object"==typeof module&&module.exports?(console.log("Using CommonJS to define module",n||""),module.exports=t.apply(t,o.map(function(e,n){return require(e)}))):(console.log("Using the native global Object to define the module",n||""),""+n?o.every(function(o,t){return o in e||!!console.warn("The dependency",o,"is not loaded into the engine yet. Skipping loading of the module",n||"")})&&(e[n]=t.apply(t,o.map(function(n,o){return e(n)}))):console.warn("The global native Object is going to be used but the module is parameter is not available."