var define = require("amdefine")(module)

define(["./example/nodejs/amdefine/build/entry"], function() {
	console.log(require("entry"))
	console.log("dsdasdasd")
})
