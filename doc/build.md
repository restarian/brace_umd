
# Brace UMD
### (Re)-building the source

------

### Document pages
* [Front Page](https://github.com/restarian/brace_umd/blob/master/README.md)
* [Use with r.js](https://github.com/restarian/brace_umd/blob/master/doc/optimizer.md)
* [Specification](https://github.com/restarian/brace_umd/blob/master/doc/specification.md)
* [License](https://github.com/restarian/brace_umd/blob/master/doc/todo.md)
* [Todo](https://github.com/restarian/brace_umd/blob/master/doc/todo.md)


----


Brace UMD is built with UglifyJS-3 and is tested on Windows 10 and Ubuntu 16. The command line program *(bin/build_umd)* accepts the exact same parameters as UglifyJS-3 does. E.g.

    build_umd --beautify comments="all",quote_style=2
The uglified data in the build directory will now contain any comments included in the lib source. The build will also not have beautified code. See <https://github.com/mishoo/UglifyJS2> for further reading on command line usage.

Only some of the uglify-js options can be used sense the build code needs to be unit tested. Therefore, only options which are defined in the *lib/tested_option.json* file will be allowed to configure. The *build_umd* script will warn when a non-tested option is attempted to be set. E.g

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

The above options are set except for any not contained in the *tested_option.json* file. One can see that the *compress.unused* and *mangle.reserved* options are set internally and thusly should never be re-configured. **Additional unit tests are needed if any properties are added to the lib/tested_option.json file.** It is safe to change the values of any properties as this serves as the default build options.

*Note*: The preamble options is special. A default string will be provided if the *output.preamble* option is set to *true*. Setting it to false will disable it like in Uglify-js.
 Setting a string will use that for the preamble.
