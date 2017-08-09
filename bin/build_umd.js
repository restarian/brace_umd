#!/usr/bin/env node
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

var path = require("path"),
fs = require("fs"),
lib = path.join(path.dirname(fs.realpathSync(__filename)), "/../lib/"),
build_dir = path.join(lib, "../build/"),
info = require(lib + "../package.json"),
UglifyJS = require("uglify-js"),
program = require("commander"),
tested_option_file = "",
bare_mangle_properties = []

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
program.option("-c, --compress [options]", "Enable compressor/specify compressor options.", parse_js("compress", true));
program.option("-m, --mangle [options]", "Mangle names/specify mangler options.", parse_js("mangle", true));
program.option("--mangle-props [options]", "Mangle properties/specify mangler options.", parse_js("mangle-props", true));
program.option("-b, --beautify [options]", "Beautify output/specify output options.", parse_js("beautify", true));
//program.option("-o, --output <file>", "Output file (default STDOUT).");
program.option("--comments [filter]", "Preserve copyright comments in the output.");
program.option("--config-file <file>", "Read Uglify options from JSON file.");
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
/*
if (!program.output && program.sourceMap && program.sourceMap.url != "inline") {
    fatal("ERROR: cannot write source map to STDOUT");
}
*/
;[
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
//        require(path.parse(require.resolve("uglify-js")).dir + "/../tools/domprops").forEach(function(name) {
 //           UglifyJS._push_uniq(program.mangleProps.reserved, name);
  //      });
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
if ( program.testedOptions ) {
  tested_option_file = program.testedOptions
  // The root will be empty if the path is relative so the current working directory of the process is prepended.
  if ( !path.parse(tested_option_file).root )
    tested_option_file = path.join(process.cwd(), "/"+tested_option_file)
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
    process.exit(9);
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
/*
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
*/
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

// The only options that are known to be configurable (via the unit tests), go in the tested-options josn file. Any options (properties), added to this json data will
// be unsafe (any option property already listed there can be changed however). The json file for the tested_option file is kept in the project lib directory. The unit tests
// specify other files for testing purposes only.
tested_option_file = tested_option_file || (lib + ".unit_tested_option.js")
try { var tested_option = fs.readFileSync(tested_option_file).toString() }
catch(e) { console.log(e); process.exit(7) }


// This loops through the entire generated options object (via commander), and verifies that the Object qualifiers are contained in the tested_option
// Object. A warning is emited and the options is not transfered to the tested_option Object if it is not set prior to this loop.
//console.log(tested_option)
var tested_option = UglifyJS.minify("var a="+tested_option, {compress: false, output: {semicolons: false, quote_keys: true, quote_style: 2}})
if ( tested_option.error ) {
  console.log(tested_option.error)
  process.exit(7)
}

try { tested_option = JSON.parse(tested_option.code.replace(/^var a=/, "")) }
catch(e) { console.log(e); process.exit(7) }

var build_option = {}

var parse_option_as_object = function(opt, build_obj, test_obj, prefix) {
  // The job of this is itterate over the entire options Object and set all of the data which is contained in the tested_option Object to the build_option Object.
  // This way only options which are known to be safe with the umd exporter are used.

  for ( var a in opt )
    if ( typeof test_obj !== "object" || !(a in test_obj) ) {
      console.log("Option", prefix + (prefix&&"."||"") + a, "is not defined in the tested options file:", tested_option_file, "-- Therefore it is not safe to use and will be skipped.")
    } else if ( typeof opt[a] !== "object" || opt[a].constructor === Array ) {
      build_obj[a] = opt[a]
    } else {
      // constructor is either a Object or an Array. It is ok if the Object is non-literal (e.g. new String()).
      build_obj[a] = opt[a].constructor()
      for ( var qualifier in opt[a] )
        if ( typeof test_obj[a] !== "object" || !(qualifier in test_obj[a]) ) {
          console.log("Option", prefix + (prefix&&"."||"") + a + "." + qualifier, "is not defined in the tested options file:", tested_option_file, "-- Therefore it is not safe to use and will be skipped.")
        }
        else if ( typeof opt[a][qualifier] === "object" && !(opt[a][qualifier] instanceof Array) ) {
          build_obj[a][qualifier] = opt[a][qualifier].constructor()
          parse_option_as_object(opt[a][qualifier], build_obj[a][qualifier], test_obj[a][qualifier], prefix + (prefix&&"."||"") + a + "." + qualifier)
        }
        else {
          build_obj[a][qualifier] = opt[a][qualifier]
        }
    }
}

// Start the options iteration.
parse_option_as_object(options, build_option, tested_option, "")

// The preamble options is little special. A default string will be provided if the output.preamble option is set to true. Setting it to false will disable
// it like in Uglify-js. Setting a string will use that for the preamble.
if ( !options.output || !("preamble" in options.output) || options.output.preamble === true ) {
  if ( typeof build_option.output !== "object" )
    build_option.output = {}
  build_option.output.preamble = ("/* Generated by Brace_UMD " + info.version +" */")
} else if ( options.output.preamble === false ) {
  delete build_option.output.preamble
}
// These can not be changed so it is provided after the input parsing haapens (it should not be defined in tested_option.json).
if ( build_option.mangle ) {
  if ( typeof build_option.mangle !== "object" )
    build_option.mangle = {reserved: []}

  if ( !build_option.mangle.reserved )
    build_option.mangle.reserved = []

  // The mangle.reserved option is transformed to an Array so that the internal namspaces can be used.
  if ( !(build_option.mangle.reserved instanceof Array) )
    build_option.mangle.reserved = [build_option.mangle.reserved]
  // The umd script will not work if these namspaces are mangled.
  build_option.mangle.reserved = build_option.mangle.reserved.concat(["define", "require", "requirejs"])


  if ( build_option.mangle.properties ) {
    // This call will inject the reserved names that are required when mangle-props is used.
    if ( typeof build_option.mangle.properties !== "object" )
      build_option.mangle.properties = {reserved: []}

    if ( !(build_option.mangle.properties.reserved instanceof Array) )
      build_option.mangle.properties.reserved = []

    // The property name "require" should be reserved in mangle properties are used.
    build_option.mangle.properties.reserved.push("require")// = build_option.mangle.properties.reserved.
  }
}

console.log("Options to be used with uglify-js:\n", build_option)
console.log("Exporting data to build directory:", build_dir)

var location = build_dir + "build_options_" + info.version + ".json"
try { fs.writeFileSync(location, JSON.stringify(build_option, null, " ")) }
catch(e) { console.log(e); process.exit(7) }
console.log("Exported build options:", location)

var data = ""
try { data = fs.readFileSync(lib + "umd.js") }
catch(e) { console.log(e); process.exit(7) }

// Fetch the build source and run it through the minifier with a glabal scope variable so that it is seen as usefull by UglifyJS (otherwise it is just as good
// as nothing to the run-time so UglifyJS will discard it). Note: It is is fine to use the source in the lib directory (umd.js) instead of the built file if the wrappers
// and work uglify does are not needed.
var out = UglifyJS.minify("var discard_me="+data.toString(), build_option)
if ( out.error ) {
  console.log(out.error)
  process.exit(7)
}

location = build_dir + "umd_"+info.version+".js"

// Remove the "var z=" above so that it is an anonymouse function.
out = out.code.replace(/var\ discard_me\ *=\ */, "(")
if ( out.charAt(out.length-1) === ";" )
  out = out.substr(0, out.length-1)
out += ")"

location = build_dir + "umd_"+info.version+".js"
try { fs.writeFileSync(location, out) }
catch(e) { console.log(e); process.exit(7) }
console.log("Exported uglify-js primary script build:", location)

location = build_dir + "build_information_"+info.version+".json"
var build_info = { tested_options_file: tested_option_file, version: info.version.toString() }
try { fs.writeFileSync(location, JSON.stringify(build_info, null, " ")) }
catch(e) { console.log(e); process.exit(7) }
console.log("Exported umb build information data file:", location)

// Write out the wrapping fragment for use with the requirejs optimizer (r.js). This should go in the {wrap {start: []} } part of the r.js optimizer build file.
location = build_dir + "wrap_start_umd_"+info.version+".frag"
try { fs.writeFileSync(location, out.substr(0, out.length-2) + ";") }
catch(e) { console.log(e); process.exit(7) }
console.log("Exported uglify-js build end wrap:", location)

// and also create a simple closing wrapper.
location = build_dir + "wrap_end_umd_"+info.version+".frag"
var end_wrap = "})(this)"
try { fs.writeFileSync(location, end_wrap) }
catch(e) { console.log(e); process.exit(7) }
console.log("Exported uglify-js build end wrap:", location)

// This will signal that the script has ended successfully. The unit tests rely on this returning 5
process.exit(5)
