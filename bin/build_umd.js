#!/usr/bin/env node
/* Copyright (c) 2018 Robert Steckroth <RobertSteckroth@gmail.com>

Brace UMD resides under the MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

  Brace UMD is a unified module definition script to use when defining javascript modules.

  this file is a part of Brace UMD

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

var path = require("path"),
fs = require("fs"),
lib = path.join(__dirname, "..", "lib"),
build_dir = path.join(lib, "..", "build"),
info = require(path.join(lib, "..", "package.json")),
UglifyJS = require(path.join("..", "node_modules", "uglify-js", "tools", "node")),
program = require("commander"),
tested_option_file = "",
bare_mangle_properties = []

require(path.join("..", "node_modules", "uglify-js", "tools", "exit"))

/* The following program includes code from another module (UglifyJS). The license and code follows until specified otherwise.
UglifyJS is released under the BSD license:

Copyright 2012-2019 (c) Mihai Bazon <mihai.bazon@gmail.com>

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

var skip_keys = [ "cname", "inlined", "parent_scope", "scope", "uses_eval", "uses_with" ];
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
program.option("--tested-options [file]", "Specify which tested options file to use. Default file is lib->.unit_tested_option.js. Beware: changing from the default requires knowledge of Brace Umd.");
program.option("-p, --parse <options>", "Specify parser options.", parse_js());
program.option("-c, --compress [options]", "Enable compressor/specify compressor options.", parse_js());
program.option("-m, --mangle [options]", "Mangle names/specify mangler options.", parse_js());
program.option("--mangle-props [options]", "Mangle properties/specify mangler options.", parse_js());
program.option("-b, --beautify [options]", "Beautify output/specify output options.", parse_js());
program.option("-O, --output-opts [options]", "Output options (beautify disabled).", parse_js());
//program.option("-o, --output <file>", "Output file (default STDOUT).");
program.option("--comments [filter]", "Preserve copyright comments in the output.");
program.option("--config-file <file>", "Read minify() options from JSON file.");
//program.option("-d, --define <expr>[=value]", "Global definitions.", parse_js("define"));
//program.option("-e, --enclose [arg[,...][:value[,...]]]", "Embed everything in a big function, with configurable argument(s) & value(s).");
//program.option("--ie8", "Support non-standard Internet Explorer 8.");
//program.option("--keep-fnames", "Do not mangle/drop function names. Useful for code relying on Function.prototype.name.");
//program.option("--name-cache <file>", "File to hold mangled name mappings.");
//program.option("--rename", "Force symbol expansion.");
program.option("--no-rename", "Disable symbol expansion.");
//program.option("--self", "Build UglifyJS as a library (implies --wrap UglifyJS)");
//program.option("--source-map [options]", "Enable source map/specify source map options.", parse_js());
program.option("--timings", "Display operations run time on STDERR.");
//program.option("--toplevel", "Compress and/or mangle variables in toplevel scope.");
program.option("--verbose", "Print diagnostic messages.");
program.option("--warn", "Print warning messages.");
//program.option("--wrap <name>", "Embed everything as a function with “exports” corresponding to “name” globally.");
program.arguments("[files...]").parseArgv(process.argv);
if (program.configFile) {
    options = JSON.parse(read_file(program.configFile));
    if (options.mangle && options.mangle.properties && options.mangle.properties.regex) {
        options.mangle.properties.regex = UglifyJS.parse(options.mangle.properties.regex, {
            expression: true
        }).value;
    }
}
if (!program.output && program.sourceMap && program.sourceMap.url != "inline") {
    fatal("cannot write source map to STDOUT");
}
[
    "compress",
    "enclose",
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
if (program.verbose) {
    options.warnings = "verbose";
} else if (program.warn) {
    options.warnings = true;
}
if (options.warnings) {
    UglifyJS.AST_Node.log_function(print_error, options.warnings == "verbose");
    delete options.warnings;
}
if (program.beautify) {
    options.output = typeof program.beautify == "object" ? program.beautify : {};
    if (!("beautify" in options.output)) {
        options.output.beautify = true;
    }
}
if (program.outputOpts) {
    if (program.beautify) fatal("--beautify cannot be used with --output-opts");
    options.output = typeof program.outputOpts == "object" ? program.outputOpts : {};
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
        //require("../tools/domprops").forEach(function(name) {
         //   UglifyJS.push_uniq(program.mangleProps.reserved, name);
        //});
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
        fatal("inline source map only works with built-in parser");
    }
}
if (~program.rawArgs.indexOf("--rename")) {
    options.rename = true;
} else if (!program.rename) {
    options.rename = false;
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
if (program.self) {
    if (program.args.length) UglifyJS.AST_Node.warn("Ignoring input files since --self was passed");
    if (!options.wrap) options.wrap = "UglifyJS";
    simple_glob(UglifyJS.FILES).forEach(function(name) {
        files[convert_path(name)] = read_file(name);
    });
    run();
} else if (program.args.length) {
    simple_glob(program.args).forEach(function(name) {
        files[convert_path(name)] = read_file(name);
    });
    run();
} else {
    var chunks = [];
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", function(chunk) {
        chunks.push(chunk);
    }).on("end", function() {
        files = [ chunks.join("") ];
        run();
    });
    process.stdin.resume();
}

function convert_ast(fn) {
    return UglifyJS.AST_Node.from_mozilla_ast(Object.keys(files).reduce(fn, null));
}

function run() {
    var content = program.sourceMap && program.sourceMap.content;
    if (content && content != "inline") {
        UglifyJS.AST_Node.info("Using input source map: " + content);
        options.sourceMap.content = read_file(content, content);
    }
    if (program.timings) options.timings = true;
    try {
        if (program.parse) {
            if (program.parse.acorn) {
                files = convert_ast(function(toplevel, name) {
                    return require("acorn").parse(files[name], {
                        locations: true,
                        program: toplevel,
                        sourceFile: name
                    });
                });
            } else if (program.parse.spidermonkey) {
                files = convert_ast(function(toplevel, name) {
                    var obj = JSON.parse(files[name]);
                    if (!toplevel) return obj;
                    toplevel.body = toplevel.body.concat(obj.body);
                    return toplevel;
                });
            }
        }
    } catch (ex) {
        fatal(ex);
    }
    var result = UglifyJS.minify(files, options);
    if (result.error) {
        var ex = result.error;
        if (ex.name == "SyntaxError") {
            print_error("Parse error at " + ex.filename + ":" + ex.line + "," + ex.col);
            var file = files[ex.filename];
            if (file) {
                var col = ex.col;
                var lines = file.split(/\r?\n/);
                var line = lines[ex.line - 1];
                if (!line && !col) {
                    line = lines[ex.line - 2];
                    col = line.length;
                }
                if (line) {
                    var limit = 70;
                    if (col > limit) {
                        line = line.slice(col - limit);
                        col = limit;
                    }
                    print_error(line.slice(0, 80));
                    print_error(line.slice(0, col).replace(/\S/g, " ") + "^");
                }
            }
        } else if (ex.defs) {
            print_error("Supported options:");
            print_error(format_object(ex.defs));
        }
        fatal(ex);
    } else if (program.output == "ast") {
        if (!options.compress && !options.mangle) {
            result.ast.figure_out_scope({});
        }
        print(JSON.stringify(result.ast, function(key, value) {
            if (value) switch (key) {
              case "thedef":
                return symdef(value);
              case "enclosed":
                return value.length ? value.map(symdef) : undefined;
              case "variables":
              case "functions":
              case "globals":
                return value.size() ? value.map(symdef) : undefined;
            }
            if (skip_key(key)) return;
            if (value instanceof UglifyJS.AST_Token) return;
            if (value instanceof UglifyJS.Dictionary) return;
            if (value instanceof UglifyJS.AST_Node) {
                var result = {
                    _class: "AST_" + value.TYPE
                };
                value.CTOR.PROPS.forEach(function(prop) {
                    result[prop] = value[prop];
                });
                return result;
            }
            return value;
        }, 2));
    } else if (program.output == "spidermonkey") {
        print(JSON.stringify(UglifyJS.minify(result.code, {
            compress: false,
            mangle: false,
            output: {
                ast: true,
                code: false
            }
        }).ast.to_mozilla_ast(), null, 2));
    } else if (program.output) {
        fs.writeFileSync(program.output, result.code);
        if (result.map) {
            fs.writeFileSync(program.output + ".map", result.map);
        }
    } else {
        print(result.code);
    }
    if (program.nameCache) {
        fs.writeFileSync(program.nameCache, JSON.stringify(options.nameCache));
    }
    if (result.timings) for (var phase in result.timings) {
        print_error("- " + phase + ": " + result.timings[phase].toFixed(3) + "s");
    }
}

function fatal(message) {
    if (message instanceof Error) {
        message = message.stack.replace(/^\S*?Error:/, "ERROR:")
    } else {
        message = "ERROR: " + message;
    }
    print_error(message);
    process.exit(1);
}

// A file glob function that only supports "*" and "?" wildcards in the basename.
// Example: "foo/bar/*baz??.*.js"
// Argument `glob` may be a string or an array of strings.
// Returns an array of strings. Garbage in, garbage out.
function simple_glob(glob) {
    if (Array.isArray(glob)) {
        return [].concat.apply([], glob.map(simple_glob));
    }
    if (glob.match(/\*|\?/)) {
        var dir = path.dirname(glob);
        try {
            var entries = fs.readdirSync(dir);
        } catch (ex) {}
        if (entries) {
            var pattern = "^" + path.basename(glob)
                .replace(/[.+^$[\]\\(){}]/g, "\\$&")
                .replace(/\*/g, "[^/\\\\]*")
                .replace(/\?/g, "[^/\\\\]") + "$";
            var mod = process.platform === "win32" ? "i" : "";
            var rx = new RegExp(pattern, mod);
            var results = entries.filter(function(name) {
                return rx.test(name);
            }).map(function(name) {
                return path.join(dir, name);
            });
            if (results.length) return results;
        }
    }
    return [ glob ];
}

function read_file(path, default_value) {
    try {
        return fs.readFileSync(path, "utf8");
    } catch (ex) {
        if (ex.code == "ENOENT" && default_value != null) return default_value;
        fatal(ex);
    }
}

function parse_js(flag) {
    return function(value, options) {
        options = options || {};
        try {
            UglifyJS.parse(value, {
                expression: true
            }).walk(new UglifyJS.TreeWalker(function(node) {
                if (node instanceof UglifyJS.AST_Assign) {
                    var name = node.left.print_to_string();
                    var value = node.right;
                    if (flag) {
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
                    return value instanceof UglifyJS.AST_Constant ? value.value : value.print_to_string({
                        quote_keys: true
                    });
                }
            }));
        } catch (ex) {
            if (flag) {
                fatal("cannot parse arguments for '" + flag + "': " + value);
            } else {
                options[value] = null;
            }
        }
        return options;
    }
}

function skip_key(key) {
    return skip_keys.indexOf(key) >= 0;
}

function symdef(def) {
    var ret = (1e6 + def.id) + " " + def.name;
    if (def.mangled_name) ret += " " + def.mangled_name;
    return ret;
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

/* The following code is from this module (Brace UMD), and the license and code follows until otherwise specified.
  MIT License
Copyright (c) 2020 Robert Steckroth <RobertSteckroth@gmail.com>

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

  this file is a part of Brace UMD

 Author: Robert Edward Steckroth, Bustout, <RobertSteckroth@gmail.com> */

// The only options that are known to be configurable (via the unit tests), go in the tested-options json file. Any options (properties), added 
// to this json data will be unsafe (any option property already listed there can be changed however). The json file for the tested_option file 
// is kept in the project lib directory. The unit tests specify other files for testing purposes only.

if ( program.testedOptions ) {
	tested_option_file = program.testedOptions
	//The root will be empty if the path is relative so the current working directory of the process is prepended.
	if ( !path.parse(tested_option_file).root )
		tested_option_file = path.join(process.cwd(), "/", tested_option_file)
}
	
	
tested_option_file = tested_option_file || path.join(lib, ".unit_tested_option.js")
try { var tested_option = fs.readFileSync(tested_option_file).toString() }
catch(e) { console.log(e); process.exit(7) }

// This loops through the entire generated options object (via commander), and verifies that the Object qualifiers are contained in the tested_option
// Object. A warning is emitted and the options is not transferred to the tested_option Object if it is not set prior to this loop.
tested_option = UglifyJS.minify("var a="+tested_option, {compress: false, mangle: false, output: {semicolons: false, quote_keys: true, quote_style: 2}})
if ( tested_option.error ) {
  console.log(tested_option.error)
  process.exit(7)
}

try { tested_option = JSON.parse(tested_option.code.replace(/^var a=/, "")) }
catch(e) { console.log(e); process.exit(7) }

var build_option = {}

var parse_option_as_object = function(opt, build_obj, test_obj, prefix) {
// The job of this loop is to iterate over the entire options Object and set all of the data which is contained in the tested_option Object to the 
// build_option Object. This way only options which are known to be safe with the umd export data via the unit tests is used. The prefix is used
// for the logging text to include the Object hierarchy.

for ( var a in opt ) {
	if ( (typeof test_obj !== "object" && test_obj !== null) || !(a in test_obj) )
		console.log("Option", prefix + (prefix&&"."||"") + a, "is not defined in the tested options file:", tested_option_file,
		"-- Therefore it is not safe to use and will be skipped.")
	else if ( opt[a] === null || typeof opt[a] !== "object" || opt[a].constructor === Array )
		build_obj[a] = opt[a]
	else {
		// constructor is either a Object or an Array. It is ok if the Object is non-literal (e.g. new String()).
		build_obj[a] = new opt[a].constructor()
		for ( var qualifier in opt[a] )
			if ( typeof test_obj[a] !== "object" || !(qualifier in test_obj[a]) ) {
				console.log("Option", prefix + (prefix&&"."||"") + a + "." + qualifier, "is not defined in the tested options file:", tested_option_file,
				"-- Therefore it is not safe to use and will be skipped.")
			}
			else if ( (typeof opt[a][qualifier] === "object" && opt[a][qualifier] !== null) && !(opt[a][qualifier] instanceof Array) ) {
				build_obj[a][qualifier] = opt[a][qualifier].constructor()
				parse_option_as_object(opt[a][qualifier], build_obj[a][qualifier], test_obj[a][qualifier], prefix + (prefix&&"."||"") + a + "." + qualifier)
			}
			else 
				build_obj[a][qualifier] = opt[a][qualifier]
		}
	}
}

// Start the options iteration.
parse_option_as_object(options, build_option, tested_option, "")

var compress_option = false
// The JSON parsing is used to create a deep Object copy so that the original data can be stored after any internal options are set and removed (as in
// the compress.unused option).
if ( build_option.compress ) 
	compress_option = JSON.parse(JSON.stringify(build_option.compress))

var mangle_option = false
// The JSON parsing is used to create a deep Object copy so that the original data can be stored after any internal options are set and removed (like
// the compress.unused option).
if ( build_option.mangle ) {
	// The exports property namespace is the only on that will need to be the same when r.js optimizes again. It is set to mangle_option which will
	// be set back to build_option.mangle after the build minify is ran. There are additional minify options that need to be set because more code
	// will be added to the build source when the r.js minify process is ran which will be able to handle things like mangle without the needed 
	// reserved options set (except for exports of course).
	if ( build_option.mangle.properties ) {
		if ( typeof build_option.mangle.properties !== "object" )
			build_option.mangle.properties = {reserved: []}
		if ( !(build_option.mangle.properties.reserved instanceof Array) )
			build_option.mangle.properties.reserved = []

		// If the exports is defined in the config or via the cli for some reason then do not create two of them in the array.
		if ( build_option.mangle.properties.reserved.indexOf("exports") === -1 )
			build_option.mangle.properties.reserved.push("exports")

	}
	mangle_option = JSON.parse(JSON.stringify(build_option.mangle))
}

// The compress.unused option is set if the compress option is set to true or with additional options. This is only necessary when building the udm.js
// source the first time because uglify-js will find code that is unused. It is fine to remove unused code after the module code is inserted and 
// the r_js script runs uglify-js again on the distributable module. That is why the unused option is set when minifing the umd.js source but not
// automatically included in the exported build options (unless the unused option is manually set). The compress.unused option should be listed in 
// the tested_options file as well.
if ( typeof compress_option !== "object" )
	build_option.compress = {}

if ( !build_option.mangle )
	build_option.mangle = false

build_option.compress.unused = false
build_option.compress.dead_code = false

// The preamble options is little special. A default string will be provided if the output.preamble option is set to true. Setting it to false will disable
// it like in Uglify-js. Setting a string will use that for the preamble.
if ( !options.output || !("preamble" in options.output) || options.output.preamble === true ) {
  if ( typeof build_option.output !== "object" )
    build_option.output = {}
  build_option.output.preamble = "/* Generated by Brace_UMD " + info.version + " */"
} 
else if ( options.output.preamble === false ) 
  delete build_option.output.preamble


// These can not be changed so it is provided after the input parsing happens (it should not be defined in tested_option.json).
if ( build_option.mangle ) {
	if ( typeof build_option.mangle !== "object" )
		build_option.mangle = {reserved: []}

	if ( ! ("reserved" in build_option.mangle) || !(build_option.mangle.reserved instanceof Array) )
		build_option.mangle.reserved = []

	// The umd script will not work if these namespaces are mangled.
	build_option.mangle.reserved = build_option.mangle.reserved.concat(
		["umd", "define", "require", "requirejs", "module", "factory"]
	) 
	if ( build_option.mangle.properties ) { // This call will inject the reserved names that are required when mangle-props is used.
		// The property name "require" should be reserved if mangle properties are used so that module.require can be used by the original namespace.
		// force_type is optionally set and therefore needs to be preserved inside the script.
		build_option.mangle.properties.reserved = build_option.mangle.properties.reserved.concat(
			["define", "require", "exports", "requirejs", "factory", "force_type", "auto_anonymous"]
		)
	}
}

var data = ""
try { data = fs.readFileSync(path.join(lib, "umd.js")) }
catch(e) { console.log(e); process.exit(7) }

// Fetch the build source and run it through the minifier. Note: It is is fine to use the source code in the lib directory (umd.js), instead of the 
// built file (umd_[version].js), if the wrappers for r.js and uglifyjs minification are not needed. Uglify-js will mutate the options Object passed
// into the minify function so a JSON copy is used.
var out = UglifyJS.minify(data.toString(), JSON.parse(JSON.stringify(build_option)))
if ( out.error ) {
	console.log(out.error)
	process.exit(11)
}
out = out.code

// The compress.unused option needs to be set back to the way it was originally if the compress option is set. This needs to be done so that unused
// code is not removed until after the module code in inserted.
build_option.compress = compress_option
build_option.mangle = mangle_option

console.log("Options which will be used with uglify-js for module definitions:\n", build_option)
console.log("\nExporting data to build directory:", build_dir)

var location = path.join(build_dir, "build_options.json")
try { fs.writeFileSync(location, JSON.stringify(build_option, null, " ")) }
catch(e) { console.log(e); process.exit(7) }
console.log("Exported build options:", location)

location = path.join(build_dir, "umd.js")
try { fs.writeFileSync(location, out) }
catch(e) { console.log(e); process.exit(7) }
console.log("Exported uglify-js primary script build:", location)

// Assemble build meta data and store it in the build_information file.
location = path.join(build_dir, "build_information.json")
var build_info = { 
	tested_option_file: tested_option_file, 
	version: info.version.toString(),
	directory: build_dir
}

try { fs.writeFileSync(location, JSON.stringify(build_info, null, " ")) }
catch(e) { console.log(e); process.exit(7) }
console.log("Exported umd build information data file:", location)

// Find the first character which starts the closing bracket and function execution parenthesis to  separate them into two fragments. This 
// separates the function into two parts so that script can be injected into the function at the very bottom.
var close_index = out.search(/[\;,\s,\,]*[A-z,_]+\s*\.\s*[A-z,_]+\s*\.\s*length\s*&&\s*define\s*\(\s*\[/)

if ( close_index === -1 ) {
	console.log("The umd program was unable to parse the umd.js source code into fragments.")
	process.exit(7)
}

// Write out the wrapping fragment for use with the requirejs optimizer (r.js). This should go in the {wrap {start: []} } part of the r.js optimizer 
// build file.
location = path.join(build_dir, "wrap_start_umd.frag")
try { fs.writeFileSync(location, out.substr(0, close_index) + ";") }
catch(e) { console.log(e); process.exit(7) }
console.log("Exported uglify-js build start wrap:", location)

// Also create the closing wrapper which is pulled from the minified source and write it to the build directory.
location = path.join(build_dir, "wrap_end_umd.frag")
try { fs.writeFileSync(location, out.substr(close_index).replace(/^\s*\,/, ";")) }
catch(e) { console.log(e); process.exit(7) }
console.log("Exported uglify-js build end wrap:", location)

// This will signal that the script has ended successfully. Note: the unit tests rely on this returning 0 to indicate a successful run.
process.exit(0)
