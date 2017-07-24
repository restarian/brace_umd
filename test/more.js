
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define("stuff", [], function() {

	console.log("stuff!")
return { id : "stuff"}

})

define("more", ["stuff"], function() {

	console.log("more!")
return { id : "more"}

})

define("good", [], function() {

	console.log("good!")
return { id : "good"}


})
