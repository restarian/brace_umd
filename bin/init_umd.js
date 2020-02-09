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

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

var info = require("../package.json"),
	program = require("commander"),
	print = require("bracket_print"),
	path = require("path"),
	up = print({log_level: "", level: 0, title_stamp: false, title: false})

program.version(info.name + " " + info.version)
.usage(`[options] 

-- Brace Umd Init `+info.version+`  ----------------------------------------------------------------------------------------------------
  This script copies the Brace Umd templates to a project base directory which carries Brace Umd as a dependency. It also makes the 
proper "scripts" entry in the project json file.`)
.option("-v, --verbose", up.toStyleString("Print any and all superfluous information from the run-time."), true)
.option("-q, --quiet", up.toStyleString("No not output any log messages (including errors). This option supersedes the verbose flag."), false)
.option("-C, --no-color", up.toStyleString("Print everthing in black and white."), false)
.option("-f, --force", up.toStyleString("Overwrite any templates and script entries with the new data."), false)

.option("-s, --create-script", up.toStyleString("Create a script entry in the package.json to operate the rjs build files in the current directory.",
	"The value will change depeding on if the --create-template option is used."), false)

.option("-t, --create-template", up.toStyleString("Copy the templates from the Brace Umd template directory to the project root.",
	"The templates directory in the installed Brace Umd directory will be used otherwise."), false)

.option("-i, --input-location [directory or file path]", up.toStyleString("The project to operate on. The package.json file must be in the project root",
	"(as determined by the git repository root) or an exact path to a json config (including the filename which ends in a .json) must be provided.",
	"Example: C:\\my_projects\\project, or C:\\my_projects\\project\\config\\project.json the default will use the nearest git repository",
	"travling up from this file."), process.cwd())

require("../lib/init")(program, print({level: 1, title_stamp: false, log_title: path.join("bin", "init_umd")})).run(
	function(exit_code) { process.exit(exit_code||0) }, function(exit_code) { process.exit(exit_code||99) })

