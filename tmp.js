

var requirejs = require("requirejs")
//var define = require("amdefine")(module)
var define = requirejs.define

    define("module_one", [], function() {
        var id = "module_one";
        console.log(id + " has initialized.");
        var mod = {};
        mod.id = id;
        return mod;
    });

    define("second_module", [], function() {
        var id = "second_module";
        console.log(id + " has initialized.");
        var mod = {};
        mod.id = id;
        return mod;
    });

    requirejs.config({
        baseUrl: "./",
        nodeRequire: require
    });

    requirejs(["require", "module_one", "second_module"], function(require, one, two) {

		  //var one = require("smodule_one")
        var id = "entry";
        console.log(id + " has initialized.");
        var mod = {};
        mod.id = id;
        mod[one.id] = one;
        mod[two.id] = two;
        console.log(one, two);
        return mod;
    });
