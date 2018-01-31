
define("first", [], function() {
	
	return {
		id: "first"
	}

})

define("second", [], function() {
	
	return {
		id: "second"
	}

})

define(["first", "nope", "second"], function(first, nope, second) {

	return {
		id: "unmet",
		first: first,
		second: second
	}
})
