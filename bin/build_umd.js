#!/usr/bin/env node

var path = require("path"),
fs = require("fs"),
lib = path.join(path.dirname(fs.realpathSync(__filename)), "/../lib/"),
info = require(lib + "../package.json"),
UglifyJS = require("uglify-js"),
program = require("commander")
options = {}
// The following program includes code from another module (UglifyJS). The license and code follows until specified otherwise.

/*
UglifyJS is released under the BSD license:

Copyright 2012-2013 (c) Mihai Bazon <mihai.bazon@gmail.com>

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

    * Redistributions of source code must retain the above
      copyright notice, this list of conditions and the following
      disclaimer.

    * Redistributions in binary form must reproduce the above
      copyright notice, this list of conditions and the following
      disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
SUCH DAMAGE.
*/

// workaround for tty output truncation upon process.exit()
;[process.stdout, process.stderr].forEach(function(stream){
    if (stream._handle && stream._handle.setBlocking)
        stream._handle.setBlocking(true);
});

var skip_keys = [ "cname", "enclosed", "parent_scope", "scope", "thedef", "uses_eval", "uses_with" ];
var files = {};
var options = {
    compress: false,
    mangle: false
};
program.version(info.name + " " + info.version);
program.parseArgv = program.parse;
program.parse = undefined;
if (process.argv.indexOf("ast") >= 0) program.helpInformation = UglifyJS.describe_ast;
else if (process.argv.indexOf("options") >= 0) program.helpInformation = function() {
    var text = [];
    var options = UglifyJS.default_options();
    for (var option in options) {
        text.push("--" + (option == "output" ? "beautify" : option == "sourceMap" ? "source-map" : option) + " options:");
        text.push(format_object(options[option]));
        text.push("");
    }
    return text.join("\n");
};
program.option("-c, --compress [options]", "Enable compressor/specify compressor options.", parse_js("compress", true));
program.option("-m, --mangle [options]", "Mangle names/specify mangler options.", parse_js("mangle", true));
program.option("--mangle-props [options]", "Mangle properties/specify mangler options.", parse_js("mangle-props", true));
program.option("-b, --beautify [options]", "Beautify output/specify output options.", parse_js("beautify", true));
//program.option("-o, --output <file>", "Output file (default STDOUT).");
program.option("--comments [filter]", "Preserve copyright comments in the output.");
program.option("--config-file <file>", "Read minify() options from JSON file.");
//program.option("-d, --define <expr>[=value]", "Global definitions.", parse_js("define"));
//program.option("--ie8", "Support non-standard Internet Explorer 8.");
//program.option("--keep-fnames", "Do not mangle/drop function names. Useful for code relying on Function.prototype.name.");
//program.option("--name-cache <file>", "File to hold mangled name mappings.");
//program.option("--self", "Build UglifyJS as a library (implies --wrap UglifyJS)");
//program.option("--source-map [options]", "Enable source map/specify source map options.", parse_source_map());
//program.option("--timings", "Display operations run time on STDERR.")
//program.option("--toplevel", "Compress and/or mangle variables in toplevel scope.");
program.option("--verbose", "Print diagnostic messages.");
program.option("--warn", "Print warning messages.");
//program.option("--wrap <name>", "Embed everything as a function with “exports” corresponding to “name” globally.");
program.arguments("[files...]").parseArgv(process.argv);
if (program.configFile) {
    options = JSON.parse(read_file(program.configFile));
}
if (!program.output && program.sourceMap && program.sourceMap.url != "inline") {
    fatal("ERROR: cannot write source map to STDOUT");
}
[
    "compress",
    "ie8",
    "mangle",
    "sourceMap",
    "toplevel",
    "wrap"
].forEach(function(name) {
    if (name in program) {
        options[name] = program[name];
    }
});
if (program.beautify) {
    options.output = typeof program.beautify == "object" ? program.beautify : {};
    if (!("beautify" in options.output)) {
        options.output.beautify = true;
    }
}
if (program.comments) {
    if (typeof options.output != "object") options.output = {};
    options.output.comments = typeof program.comments == "string" ? program.comments : "some";
}
if (program.define) {
    if (typeof options.compress != "object") options.compress = {};
    if (typeof options.compress.global_defs != "object") options.compress.global_defs = {};
    for (var expr in program.define) {
        options.compress.global_defs[expr] = program.define[expr];
    }
}
if (program.keepFnames) {
    options.keep_fnames = true;
}

if (program.mangleProps) {
    if (program.mangleProps.domprops) {
        delete program.mangleProps.domprops;
    } else {
        if (typeof program.mangleProps != "object") program.mangleProps = {};
        if (!Array.isArray(program.mangleProps.reserved)) program.mangleProps.reserved = [];
        require("../tools/domprops").forEach(function(name) {
            UglifyJS._push_uniq(program.mangleProps.reserved, name);
        });
    }
    if (typeof options.mangle != "object") options.mangle = {};
    options.mangle.properties = program.mangleProps;
}

if (program.nameCache) {
    options.nameCache = JSON.parse(read_file(program.nameCache, "{}"));
}
if (program.output == "ast") {
    options.output = {
        ast: true,
        code: false
    };
}
if (program.parse) {
    if (!program.parse.acorn && !program.parse.spidermonkey) {
        options.parse = program.parse;
    } else if (program.sourceMap && program.sourceMap.content == "inline") {
        fatal("ERROR: inline source map only works with built-in parser");
    }
}
var convert_path = function(name) {
    return name;
};
if (typeof program.sourceMap == "object" && "base" in program.sourceMap) {
    convert_path = function() {
        var base = program.sourceMap.base;
        delete options.sourceMap.base;
        return function(name) {
            return path.relative(base, name);
        };
    }();
}
if (program.verbose) {
    options.warnings = "verbose";
} else if (program.warn) {
    options.warnings = true;
}


function fatal(message) {
    if (message instanceof Error) message = message.stack.replace(/^\S*?Error:/, "ERROR:")
    print_error(message);
    process.exit(1);
}


function read_file(path, default_value) {
    try {
        return fs.readFileSync(path, "utf8");
    } catch (ex) {
        if (ex.code == "ENOENT" && default_value != null) return default_value;
        fatal(ex);
    }
}

function parse_js(flag, constants) {
    return function(value, options) {
        options = options || {};
        try {
            UglifyJS.minify(value, {
                parse: {
                    expression: true
                },
                compress: false,
                mangle: false,
                output: {
                    ast: true,
                    code: false
                }
            }).ast.walk(new UglifyJS.TreeWalker(function(node) {
                if (node instanceof UglifyJS.AST_Assign) {
                    var name = node.left.print_to_string();
                    var value = node.right;
                    if (!constants) {
                        options[name] = value;
                    } else if (value instanceof UglifyJS.AST_Array) {
                        options[name] = value.elements.map(to_string);
                    } else {
                        options[name] = to_string(value);
                    }
                    return true;
                }
                if (node instanceof UglifyJS.AST_Symbol || node instanceof UglifyJS.AST_PropAccess) {
                    var name = node.print_to_string();
                    options[name] = true;
                    return true;
                }
                if (!(node instanceof UglifyJS.AST_Sequence)) throw node;

                function to_string(value) {
                    return value instanceof UglifyJS.AST_Constant ? value.getValue() : value.print_to_string({
                        quote_keys: true
                    });
                }
            }));
        } catch(ex) {
            options[value] = null;
        }
        return options;
    }
}

function parse_source_map() {
    var parse = parse_js("sourceMap", true);
    return function(value, options) {
        var hasContent = options && "content" in options;
        var settings = parse(value, options);
        if (!hasContent && settings.content && settings.content != "inline") {
            print_error("INFO: Using input source map: " + settings.content);
            settings.content = read_file(settings.content, settings.content);
        }
        return settings;
    }
}

function skip_key(key) {
    return skip_keys.indexOf(key) >= 0;
}

function format_object(obj) {
    var lines = [];
    var padding = "";
    Object.keys(obj).map(function(name) {
        if (padding.length < name.length) padding = Array(name.length + 1).join(" ");
        return [ name, JSON.stringify(obj[name]) ];
    }).forEach(function(tokens) {
        lines.push("  " + tokens[0] + padding.slice(tokens[0].length - 2) + tokens[1]);
    });
    return lines.join("\n");
}

function print_error(msg) {
    process.stderr.write(msg);
    process.stderr.write("\n");
}

function print(txt) {
    process.stdout.write(txt);
    process.stdout.write("\n");
}

// End of UglifyJS code -------------------------------------------
// The following code is from this module (Brace UMD), and the license and code follows until otherwise specified.
/*
Copyright (c) 2017 Robert Steckroth <RobertSteckroth@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

  Brace UMD is a unified module definition script to use when defining javascript modules.

  this code segment is a part of Brace UMD

 Author: Robert Edward Steckroth II, Bustout, <RobertSteckroth@gmail.com>
*/

// The only options that are known to be configurable (from unit tests), go here. Any options added to this Object is unsafe (all options listed below can be
// changed however). The tested_option Object is kept in the project directory so that the unit tests have the same data as this program.
var tested_option = require(lib + "tested_option.json")
// This loops through the entire generated options object (via commander), and verifies that the Object qualifiers are contained in the tested_option
// Object. A warning is emited and the options is not transfered to the tested_option Object if it is not set prior to this loop.

var break_first = false
for ( var a in options )
  for ( var b in options[a] ) {
    if ( break_first ) {
      break_first = false
      break
    }
    if ( !(a in tested_option) ) {
      console.warn("Option", a, "is not defined in the tested_option.json file therefore is not safe to use.")
      break_first = true
      break
    }
    else {
      for ( var b in options[a] )
        if ( !(b in tested_option[a]) ) {
          console.warn("Option", a + "." + b, "is not defined in the tested_option.json file therefore is not safe to use.")
    //      break_first = true
        }
        else {
            tested_option[a] = tested_option[a] || {}
            tested_option[a][b] = options[a][b]
        }
    }
  }

// The preamble options is little special. A default string will be provided if the output.preamble option is set to true. Setting it to false will disable it like in Uglify-js.
// Setting a string will use that for the preamble.
tested_option.output.preamble = tested_option.output.preamble === true && ("/* Generated by Brace_UMD " + info.version +" */") || tested_option.output.preamble
// These can not be changed so it is provided after the input parsing haapens (it should not be defined in tested_option.json).
tested_option["mangle"]["reserved"] = ["define", "require", "requirejs"]
tested_option["compress"]["unused"] = false
console.log("Options to be used with uglify-js:\n", tested_option)

var location = path.join(lib, "../build/build_options_") + info.version + ".json"
fs.writeFile(location, JSON.stringify(tested_option), (err) => {
  if (err) { throw err; return }
  console.log("Exported build options:", location)
})
// This will create the run-time source code from the lib source. It is is fine to use the source in the lib directory if the wrappers and extra effeciency is not needed.
fs.readFile(lib + "umd.js", (err, data) => {
  if (err) { throw err; return }

  // Get the raw source and run it through the minifier with a glabal scope variable so that it is seen as usefull by UglifyJS (otherwise it is just as good as nothing to the run-time
  // so UglifyJS will discard it).
	var out = UglifyJS.minify("var discard_me="+data.toString(), tested_option), location = path.join(lib, "../build/") + "umd_"+info.version+".js"
  // Remove the "var z=" above so that it is an anonymouse function.
  out = out.code.replace(/var\ discard_me\ *=\ */, "(")
  if ( out.charAt(out.length-1) === ";" )
    out = out.substr(0, out.length-1)
  out += ")"
  var build_dir = path.join(lib, "../build/")
  location = build_dir + "umd_"+info.version+".js"
	fs.writeFile(location, out, (err) => {
  	if (err) { throw err; return }
    console.log("Exported uglify-js primary script build:", location)
/*
    location = build_dir + "umd_commonjs_"+info.version+".js"
    fs.writeFile(location, "module.exports="+out, (err) => {
  	  if (err) { throw err; return }
    	console.log("Exported uglify-js CommonJS module build:", location)
*/
      // Write out the wrapping fragment for use with the requirejs optimizer (r.js). This should go in the {wrap {start: []} } part of the r.js optimizer build file.
      location = build_dir + "wrap_start_umd_"+info.version+".frag"
    	fs.writeFile(location, out.substr(0, out.length-2), (err) => {
        if (err) { throw err; return }
    		console.log("Exported uglify-js build end wrap:", location)

        // and also create a simple closing wrapper.
        location = build_dir + "wrap_end_umd_"+info.version+".frag"
        fs.writeFile(location, "})(this)", (err) => {
          if (err) { throw err; return }
      		console.log("Exported uglify-js build end wrap:", location)
          // so windows cli will return back to the prompt.
          process.exit()
      	})
 //   	})
  	})
	})

})
