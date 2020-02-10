/* Copyright (c) 2018 Robert Steckroth <RobertSteckroth@gmail.com>

Brace UMD resides under the MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

Brace Umd is a module building platform with an integrated unified module definition wrapper.

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["bracket_print", "bracket_utils"], function(print, utils) {

	var path = require("path"), fs = require("fs")
	return function(program, up) {
	// The entry point for the document parser API which aligns all of the calls to form the result. The program argument is maditory and can be either
	// an object literal or a commander instance. The up argument (bracket print instance), is optional as one will be created if it is omitted.

		// The simplest way to determine if the argument is of the bracket_print type.
		if ( up && up.parent && (up instanceof up.parent) )
			this.up = up = up.spawn({compression: 1}, up.log_title+" -> ")
		else
			this.up = up = print({compression: 1, level: 1, title: true, title_stamp: false})

		up.log_title = up.log_title + "brace_umd_init"
		this.up_err = up_err = up.spawn({level: 2, log_title: up.log_title+" - ERROR"})

		// Create the parser instance with the local logger so that the title and options are matched and linked.
		var option, program = program || {}
		if ( typeof program.parse === "function" )
			option = program.parse(process.argv)
		else
			option = program

		// The verbose option set from the command line will change the print prototype so that any print instances will be affected unless
		// it is explicitly re-set (which is not advisable with the log_level option).
		if ( option.quiet )
			// Do not even print the errors if the quiet flag is set.
			print.prototype.log_level = "0"
		else if ( option.verbose )
			// Empty is all values
			print.prototype.log_level = "0,1,2"
		else
			print.prototype.log_level = "0,2"

		if ( "color" in option )
			print.prototype.style = Boolean(option.color)
		else
			print.prototype.style = true

		if ( typeof program.parse === "function" )
			console.log("Using parameters:", program.opts())

		this.template_file = ["rjs_build_first.js", "rjs_build_second.js", "uglify_option.json"]

		if ( typeof option.inputLocation !== "string" || !option.inputLocation )
			input_location = ""
		else
			input_location = option.inputLocation

		if ( !path.isAbsolute(input_location) )
			input_location = path.normalize(path.join(process.cwd(), input_location))
		else
			input_location = path.normalize(input_location)

		this.getJsonFile = function(dir, cb, err) {

			var input = path.normalize(dir)
			if ( path.extname(input) !== ".json" ) {

				utils.projectRoot(input, function(project_dir) {

					cb(path.join(project_dir, "package.json"))
				}, function() { err(up_err.log("Unable to get project root from input-location of:", input_path)) })
			}
			else
				cb(input)
		}

		this.retrieveJson = function(filepath, cb, err_cb) {

			fs.stat(filepath, function(error) {

				if ( error )
					return err_cb(up_err.log("retrieveJson(): Unable to locate the requested package.json file at:", filepath))

				up.log("retrieveJson(): Using repository json file at:", filepath)
				var json = null
				json = fs.readFile(filepath, function(err, data) {

					if ( err ) 
						return err_cb(up_err.log("retrieveJson(): Unable to load the json file:", filepath, err)) 
					try {
						json = JSON.parse(data.toString())
						return cb(json)
					} 
					catch(e) { 
						return err_cb(up_err.log("retrieveJson(): Unable to load the json file:", filepath, e)) 
					}
				})
			})
		}

		this.createScriptObject = function(json, filepath, cb, err_cb) {

			if ( !option.createScript )
				return cb()

			var str = up.spawn({style: false, log_level: "", title: false, quote_qualifier: true, denote_quoting: "\"", compression: 1})
			var dir = path.dirname(filepath)
			if ( json === null || typeof json !== "object" ) 
				return err_cb(up_err.log("createScriptObject(): The json file was not loaded as an Object type."))

			var msg = up.a()
			json.scripts = json.scripts || {}
			var sub = option.createTemplate&&"./"||"./node_modules/brace_umd/template/"

			if ( !option.force && ("build_config" in json.scripts) )
				msg.l("The build_config entry already exists and will not be written.")
			else
				json.scripts.build_config = str.s("build_umd --config-file uglify_option.json").toString()

			if ( !option.force && ("build_amd" in json.scripts) )
				msg.l("The build_amd entry already exists and will not be written.")
			else
				json.scripts.build_amd = str.s("r_js -o", sub).a("rjs_build_first.js").s("&& r_js -o", sub).a("rjs_build_second.js").toString()

			if ( !option.force && ("build_umd" in json.scripts) )
				msg.l("The build_umd entry already exists and will not be written.")
			else
				json.scripts.build_umd = str.s("r_js -o", sub).a("rjs_build_first.js").s("&& r_js -o", sub).a("rjs_build_second.js suffix=\"_umd\"").toString()

			if ( !option.force && ("build" in json.scripts) )
				msg.l("The build entry already exists and will not be written.")
			else
				json.scripts.build = str.s("npm run build_config && npm run build_umd && npm run build_amd").toString()

				if ( msg.toString().length )
					up.s("createScriptObject(): Using file:").s(filepath, "->",).l(msg, "Note: setting --force will override this safety mechanism.").log()

			fs.writeFile(filepath, str.toString(json), function(err) {
				if ( err )
					err_cb(up_err.log("createScriptObject(): Unable to write json file:", filepath))
				else
					up.log_true("createScriptObject(): Successfully wrote json file to:", filepath, json) && cb(json)
			})
		}

		this.createTemplate = function(filepath, cb, err_cb) {

			if ( !option.createTemplate )
				return cb()

			var msg = up.a()
			var dir = path.dirname(filepath)
			var template_file = this.template_file.slice(0)

			var copy = function(file) {

				if ( !file ) {
					if ( msg.toString().length )
						up.log("createTemplate():", msg, "Note: setting --force will override this safety mechanism.")
					return cb()
				}

				filepath = path.join(dir, file)

				fs.stat(filepath, function(error) {

					if ( !option.force && !error ) {
						msg.l("The file").s(filepath, "already exists.")
						copy(template_file.shift())
					}
					else
						fs.copyFile(path.join(dir, "node_modules", "brace_umd", "template", file), filepath, function(error) {
							if ( error )
								err_cb(up_err.log("createTemplate(): Unable to write template file:", filepath, error))
							else
								up.log_true("createTemplate(): Successfully wrote template file to:", filepath) && copy(template_file.shift())
						})
				})
			}
			copy(template_file.shift())
		}

		this.run = function(cb, err_cb) {

			cb = typeof cb === "function" && cb || function(){}
			err_cb = typeof err_cb === "function" && err_cb || function(){}

			this.getJsonFile(input_location, function(filepath) {
				this.retrieveJson(filepath, function(json) {
					this.createScriptObject(json, filepath, function(obj) {
						this.createTemplate(filepath, function() {

							up.log_true("SUCCESS") && cb(0)
						}, err_cb.bind(null, 13))
					}, err_cb.bind(null, 12))
				}, err_cb.bind(null, 11))
			}, err_cb.bind(null, 10))
		}

		return this
	}
})
