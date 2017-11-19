
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

define(function(require) {

	return {
		id: "stand_alone",
		require: require
	}
})
