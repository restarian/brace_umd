
# Brace UMD
### (Re)building the source

------

### Document pages
* [Front Page](https://github.com/restarian/brace_umd/blob/master/README.md)
* [Using with r.js](https://github.com/restarian/brace_umd/blob/master/doc/optimizer.md)
* [Specification](https://github.com/restarian/brace_umd/blob/master/doc/specification.md)
* [Licenses](https://github.com/restarian/brace_umd/blob/master/doc/license.md)
* [Todo](https://github.com/restarian/brace_umd/blob/master/doc/todo.md)


----


Brace UMD is built with UglifyJS-3 and is tested on Windows 10 and Ubuntu 16. The command line program *(bin/build_umd)* accepts the exact same parameters as UglifyJS-3 does. E.g.

    build_umd --beautify comments="all",beautify=false
Given the above command, the uglified data in the build directory will contain any comments included in the lib source. The builds will also not have beautified code. See <https://github.com/mishoo/UglifyJS2> for further reading on command line usage.

Only some of the uglify-js options can be used sense the build code needs to be unit tested. Therefore, only options which are defined in the *lib/tested_option.json* file will be configurable. The *build_umd* script will warn when a non-tested option is attempted to be set. E.g

    :> bin/build_umd.js  --compress unused,unsafe --beautify --comments="all"
    Option compress.unused is not defined in the tested_option.json file therefore is not safe to use.
    Option compress.unsafe is not defined in the tested_option.json file therefore is not safe to use.
    Options to be used with Uglify-js:
    { output:
       { beautify: true,
         quote_keys: false,
         quote_style: 0,
         comments: 'all' },
      compress:
       { sequences: false,
         global_defs: { DEBUG: false },
         unused: false },
      warnings: true,
      mangle: { reserved: [ 'define', 'require', 'requirejs' ] } }
    Exported build options: C:\Users\Rober\AppData\Roaming\npm\node_modules\brace_umd\build\build_options_0.2.2.txt
    Exported uglify-js primary script build: /mnt/c/Users/Rober/AppData/Roaming/npm/node_modules/brace_umd/build/umd_0.2.2.js
    Exported uglify-js build end wrap: /mnt/c/Users/Rober/AppData/Roaming/npm/node_modules/brace_umd/build/wrap_start_umd_0.2.2.frag
    Exported uglify-js build end wrap: /mnt/c/Users/Rober/AppData/Roaming/npm/node_modules/brace_umd/build/wrap_end_umd_0.2.2.frag

The above options passed in to the command are set except for those which are not defined in the *tested_option.json* file. Notice that the the *compress.unused* and *mangle.reserved* options are set internally (can not be changed without breaking the build source), and thusly are not set. **Additional unit tests are needed if any properties are added to the lib/tested_option.json file.** It is safe to change the values of any properties defined in the file contained in the commit of the repo. The options stored are used as the default build options.

*Note*: The *output.preamble* option is special. A default string will be provided if the *output.preamble* option is set to *true*. Setting this to false will disable it (same as with uglify-js).
 Setting a string to it will use that for the preamble.
