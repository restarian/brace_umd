## How to use option data

---
### Document pages

---

### Passing in option data to the UMD can happen in two ways.
#### First way

The option data can be manually added to the function call as parameter. The option data must be the last 
parameter and all of the other parameters must always remain in the call. The snippet below is an example 
of how to pass in the *auto_anonymous* option to the umd wrapper.
```javascript
}(this, typeof define === "function" && define || undefined,
	 typeof requirejs === "function" && requirejs || undefined, {auto_anonymous: true})
// Note: auto_anonymous should not be used as a 
```

#### Second way

Option data can be passed to the UMD wrapper via the *wrap_end_option({[option data]})* member contained
in the loaded commonjs module. This member will add the data to the UMD wrapper function call like above
and return the updated closing fragment. The closing fragment can then be used as a closing wrapper 
string in the optimizer build config. Below is how the requirejs build config uses the fragment and has 
the same result as the method above.
```javascript
wrap: {
 start: nodeRequire("brace_umd").wrap_start,
 end: nodeRequire("brace_umd").wrap_end_option({auto_anonymous: true})
}

```
	

