
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
		id: "stand_alone",
		first: first,
		second: second
	}
})
