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
//program.option("-p, --parse <options>", "Specify parser options.", parse_js("parse", true));
program.option("-c, --compress [options]", "Enable compressor/specify compressor options.", parse_js("compress", true));
program.option("-m, --mangle [options]", "Mangle names/specify mangler options.", parse_js("mangle", true));
program.option("--mangle-props [options]", "Mangle properties/specify mangler options.", parse_js("mangle-props", true));
program.option("-b, --beautify [options]", "Beautify output/specify output options.", parse_js("beautify", true));
program.option("-o, --output <file>", "Output file (default STDOUT).");
program.option("--comments [filter]", "Preserve copyright comments in the output.");
program.option("--config-file <file>", "Read minify() options from JSON file.");
//program.option("-d, --define <expr>[=value]", "Global definitions.", parse_js("define"));
//program.option("--ie8", "Support non-standard Internet Explorer 8.");
program.option("--keep-fnames", "Do not mangle/drop function names. Useful for code relying on Function.prototype.name.");
program.option("--name-cache <file>", "File to hold mangled name mappings.");
//program.option("--self", "Build UglifyJS as a library (implies --wrap UglifyJS)");
//program.option("--source-map [options]", "Enable source map/specify source map options.", parse_source_map());
//program.option("--timings", "Display operations run time on STDERR.")
//program.option("--toplevel", "Compress and/or mangle variables in toplevel scope.");
//program.option("--verbose", "Print diagnostic messages.");
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

if (program.self) {
    if (program.args.length) {
        print_error("WARN: Ignoring input files since --self was passed");
    }
    if (!options.wrap) options.wrap = "UglifyJS";
    simple_glob(UglifyJS.FILES).forEach(function(name) {
        files[convert_path(name)] = read_file(name);
    });
    //run();
} else if (program.args.length) {
    simple_glob(program.args).forEach(function(name) {
        files[convert_path(name)] = read_file(name);
    });
    //run();
} else {
    var chunks = [];
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", function(chunk) {
        chunks.push(chunk);
    }).on("end", function() {
        files = [ chunks.join("") ];
        //run();
    });
    process.stdin.resume();
}

function convert_ast(fn) {
    return UglifyJS.AST_Node.from_mozilla_ast(Object.keys(files).reduce(fn, null));
}

function run() {
    UglifyJS.AST_Node.warn_function = function(msg) {
        print_error("WARN: " + msg);
    };
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
            var col = ex.col;
            var lines = files[ex.filename].split(/\r?\n/);
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
        if (ex.defs) {
            print_error("Supported options:");
            print_error(format_object(ex.defs));
        }
        fatal(ex);
    } else if (program.output == "ast") {
        print(JSON.stringify(result.ast, function(key, value) {
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
    if (message instanceof Error) message = message.stack.replace(/^\S*?Error:/, "ERROR:")
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
Copyright (c) 2017 Robert Edward Steckroth

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
// changed however). The tested_options Object is kept in the project directory so that the unit tests have the same data as this program.
var tested_options = require(lib + "tested_options.json")
// This loops through the entire generated options object (via commander), and verifies that the Object qualifiers are contained in the tested_options
// Object. A warning is emited and the options is not transfered to the tested_options Object if it is not set prior to this loop.
var break_first = false
for ( var a in options )
  for ( var b in options[a] ) {
    if ( break_first ) {
      break_first = false
      break
    }
    if ( !(a in tested_options) ) {
      console.warn("Option", a, "is not defined in the tested_option.json file therefore is not safe to use.")
      break
    }
    else {
      for ( var b in options[a] )
        if ( !(b in tested_options[a]) ) {
          console.warn("Option", a + "." + b, "is not defined in the tested_option.json file therefore is not safe to use.")
          break_first = true
        }
        else {
            tested_options[a] = tested_options[a] || {}
            tested_options[a][b] = options[a][b]
        }
    }
  }

console.log(tested_options)
// This will create the run-time source code from the lib source. It is is fine to use the source in the lib directory if the wrappers and extra effeciency is not needed.
fs.readFile(lib + "umd.js", (err, data) => {
  if (err) { throw err; return }

  // Get the raw source and run it through the minifier with a glabal scope variable so that it is seen as usefull by UglifyJS (otherwise it is just as good as nothing to the run-time
  // so UglifyJS will discard it).
	var out = UglifyJS.minify("var z="+data.toString(), tested_options), location = path.join(lib, "../builds/") + "umd_"+info.version+".js"
  // Remove the "var z=" above so that it is an anonymouse function.
  var out = "(" + out.code.substr(6, out.code.length-7) + ")"
  var build_dir = path.join(lib, "../builds/")
  location = build_dir + "umd_"+info.version+".js"
	fs.writeFile(location, out, (err) => {
  	if (err) { throw err; return }
    console.log("Finished UglifyJS primary script build:", location)
/*
    location = build_dir + "umd_commonjs_"+info.version+".js"
    fs.writeFile(location, "module.exports="+out, (err) => {
  	  if (err) { throw err; return }
    	console.log("Finished UglifyJS CommonJS module build:", location)
*/
      // Write out the wrapping fragment for use with the requirejs optimizer (r.js). This should go in the {wrap {start: []} } part of the r.js optimizer build file.
      location = build_dir + "wrap_start_umd_"+info.version+".frag"
    	fs.writeFile(location, out.substr(0, out.length-2), (err) => {
        if (err) { throw err; return }
    		console.log("finished uglifyjs build end wrap:", location)

        // and also create a simple closing wrapper.
        location = build_dir + "wrap_end_umd_"+info.version+".frag"
        fs.writeFile(location, "})(this)", (err) => {
          if (err) { throw err; return }
      		console.log("finished uglifyjs build end wrap:", location)
          // so windows cli will return back to the prompt.
          process.exit()
      	})
 //   	})
  	})
	})

})
