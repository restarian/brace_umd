## Available option data

---
### Document pages

---

**Options:**

* auto_anonymous: *Boolean*
	
This option will enable automatic creation of anonymous  amdefine modules. The last define call encountered inside the umd wrapper will have its id as A dependency requirement for a non-id define call. This will have module export a module value when a require is done within commonjs environments. However, it is only practical to use this when using the requirejs optimizer as the main entry module may not be defined lastly otherwise. Therefore, the *auto_anonymous* option should generally only be used via the ```nodeRequire("brace_umd").wrap_end_option({auto_anonymous: true})``` method.

* force_type: *String*

This option will convert all definition types into the one specified. E.g. ```{force_type: "requirejs"}``` will use requirejs as the only definition type even if *define* is specified in the module. This is possible because all AMD syntax is similar. E.g. *function(id, deps array, callback, err_callback)*

