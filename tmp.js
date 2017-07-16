if (typeof define !== 'function') { var define = require('amdefine')(module) }

define("aa", ["bb"], function() {
  console.log("Init aa")
  return {
    id: "aa"
  }
})

define("bb", [], function() {
  console.log("Init bb")
  return {
    id: "aa"
  }
})

define(function(require) {

    console.log("Init main", __filename)
//    var aa = require("./cc")
    return {
        aa: require("aa"),
        bb: require("bb")
    }
})
