#!/usr/bin/env node
/* MIT License
Copyright (c) 2018 Robert Steckroth <RobertSteckroth@gmail.com>

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

 Author: Robert Edward Steckroth II, Bustout, <RobertSteckroth@gmail.com> */

var path = require("path"),
fs = require("fs"),
lib = path.join(__dirname, "/..", "/lib"),
build_dir = path.join(lib, "/..", "/build"),
info = require(path.join(lib, "/..", "/package.json")),
UglifyJS = require("uglify-js"),
program = require("commander"),
tested_option_file = "",
bare_mangle_properties = []


/* The following program includes code from another module (UglifyJS). The license and code follows until specified otherwise.
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
program.option("--timings", "Display operations run time on STDERR.")
//program.option("--toplevel", "Compress and/or mangle variables in toplevel scope.");
program.option("--verbose", "Print diagnostic messages.");
program.option("--warn", "Print warning messages.");
//program.option("--wrap <name>", "Embed everything as a function with “exports” corresponding to “name” globally.");
program.arguments("[files...]").parseArgv(process.argv);
if ( program.configFile ) {
	try {
    options = JSON.parse(read_file(program.configFile));
	 // These should default to false but do not for some reason in uglify. Without this, the mangle and compress options are used if not specified or defined.
	} catch(e) {
		console.log("Unable to parse config file:", program.configFile, e)
		process.exit(13)
	}
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
    tested_option_file = path.join(process.cwd(), "/", tested_option_file)
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

/* The following code is from this module (Brace UMD), and the license and code follows until otherwise specified.
  MIT License
Copyright (c) 2018 Robert Steckroth <RobertSteckroth@gmail.com>

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
tested_option_file = tested_option_file || path.join(lib, "/.unit_tested_option.js")
try { var tested_option = fs.readFileSync(tested_option_file).toString() }
catch(e) { console.log(e); process.exit(7) }


// This loops through the entire generated options object (via commander), and verifies that the Object qualifiers are contained in the tested_option
// Object. A warning is emitted and the options is not transferred to the tested_option Object if it is not set prior to this loop.
var tested_option = UglifyJS.minify("var a="+tested_option, {compress: false, mangle: false, output: {semicolons: false, quote_keys: true, quote_style: 2}})
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

  for ( var a in opt )
    if ( (typeof test_obj !== "object" && test_obj !== null) || !(a in test_obj) ) {
      console.log("Option", prefix + (prefix&&"."||"") + a, "is not defined in the tested options file:", tested_option_file,
						 "-- Therefore it is not safe to use and will be skipped.")
    } else if ( opt[a] === null || typeof opt[a] !== "object" || opt[a].constructor === Array ) {
      build_obj[a] = opt[a]
    } else {
      // constructor is either a Object or an Array. It is ok if the Object is non-literal (e.g. new String()).
      build_obj[a] = opt[a].constructor()
      for ( var qualifier in opt[a] )
        if ( typeof test_obj[a] !== "object" || !(qualifier in test_obj[a]) ) {
          console.log("Option", prefix + (prefix&&"."||"") + a + "." + qualifier, "is not defined in the tested options file:", tested_option_file,
							 "-- Therefore it is not safe to use and will be skipped.")
        }
        else if ( (typeof opt[a][qualifier] === "object" && opt[a][qualifier] !== null) && !(opt[a][qualifier] instanceof Array) ) {
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
  build_option.output.preamble = ("/* Generated by Brace_UMD " + info.version +" */")
} else if ( options.output.preamble === false ) {
  delete build_option.output.preamble
}

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
try { data = fs.readFileSync(path.join(lib, "/umd.js")) }
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

var location = path.join(build_dir, "/build_options.json")
try { fs.writeFileSync(location, JSON.stringify(build_option, null, " ")) }
catch(e) { console.log(e); process.exit(7) }
console.log("Exported build options:", location)

location = path.join(build_dir, "/umd.js")
try { fs.writeFileSync(location, out) }
catch(e) { console.log(e); process.exit(7) }
console.log("Exported uglify-js primary script build:", location)

// Assemble build meta data and store it in the build_information file.
location = path.join(build_dir, "/build_information.json")
var build_info = { 
	tested_options_file: tested_option_file, 
	version: info.version.toString(),
	directory: build_dir
}

try { fs.writeFileSync(location, JSON.stringify(build_info, null, " ")) }
catch(e) { console.log(e); process.exit(7) }
console.log("Exported umd build information data file:", location)

// Find the first character which starts the closing bracket and function execution parenthesis to to separate them into two fragments. This 
// separates the function into two parts so that script can be injected into the function at the very bottom.
var close_index = out.match(/([\;,\n,\r,\,]+)[\s,\n,\r]*([a-z,\_,\-]+\.[a-z,\_,\-]+\.length\s*\&\&[\s,\n,\r]*define\([\s,\n,\r]*\[[^\]]+\][^\)]+\)[^\}]+[\s,\n,\r]*\}[\s,\n,\r]*\)\;*[\s,\n,\r]*\}[^\}]*\{\}\)[\s,\;]*)$/)

if ( !close_index || close_index.length < 3 ) {
	console.log("The umd program was unable to parse the umd.js source code into fragments.")
	process.exit(7)
}
// Write out the wrapping fragment for use with the requirejs optimizer (r.js). This should go in the {wrap {start: []} } part of the r.js optimizer 
// build file.
location = path.join(build_dir, "/wrap_start_umd.frag")
try { fs.writeFileSync(location, out.substr(0, out.indexOf(close_index[0])) + ";") }
catch(e) { console.log(e); process.exit(7) }
console.log("Exported uglify-js build end wrap:", location)

// Also create the closing wrapper which is pulled from the minified source and write it to the build directory.
location = path.join(build_dir, "/wrap_end_umd.frag")
try { fs.writeFileSync(location, close_index[2]) }
catch(e) { console.log(e); process.exit(7) }
console.log("Exported uglify-js build end wrap:", location)

// This will signal that the script has ended successfully. Note: the unit tests rely on this returning 0 to indicate a successful run.
process.exit(0)
