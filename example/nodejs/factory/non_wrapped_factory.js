
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

define(["first", "second"], function(first, second) {

	return {
		first: first,
		second: second
	}
})
