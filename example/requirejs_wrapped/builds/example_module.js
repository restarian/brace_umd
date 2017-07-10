/home/surge/dev_packages/node-v7.10.0-linux-x64/lib/node_modules/requirejs/bin/node_modules,/home/surge/dev_packages/node-v7.10.0-linux-x64/lib/node_modules/requirejs/node_modules,/home/surge/dev_packages/node-v7.10.0-linux-x64/lib/node_modules,/home/surge/dev_packages/node-v7.10.0-linux-x64/node_modules,/home/surge/dev_packages/node_modules,/home/surge/node_modules,/home/node_modules,/node_modules


define('another_module',["another_module"], function(a) {

    console.log("My module init'ed")
    return {
      cool: "joes"
    }
})
;


define('example_module',["another_module"], function(a) {

    console.log("My module init'ed")
    return {
      cool: "joes"
    }
})
;
aaaaaaaaa
