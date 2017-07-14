# Brace UMD
### Unit testing

------

### Document pages
* [Synopsis](https://github.com/restarian/brace_umd/blob/master/README.md)
* [Building UMD source](https://github.com/restarian/brace_umd/blob/master/doc/build.md)
* [Using with r.js](https://github.com/restarian/brace_umd/blob/master/doc/optimizer.md)
* [Specification](https://github.com/restarian/brace_umd/blob/master/doc/specification.md)
* [Todo](https://github.com/restarian/brace_umd/blob/master/doc/todo.md)

----

** Output of unit testing**
      
      > mocha
      The build script
      as a shell process
        √ should export the correct build file when no cli arguments are utilized. (453ms)
        √ should provide a warning message when internally set options are attempted to be set (440ms)
        √ should provide a warning message when non-tested options which are attempted to be set (437ms)
        √ create the proper mangle and compress output with the unit test file a (432ms)
        √ create the proper mangle and compress output with the unit test file b (434ms)
        √ should not make the changes of internally and non-tested build options which attempted to be set (436ms)
        √ should warn ans exit when the tested-options file does not exist (319ms)
        √ should not make the changes of non-tested build options which are attempted to be set (435ms)
        √ odd cli arguments are processed appropriately (428ms)
      Module loading
          √
      10 passing (4s)
