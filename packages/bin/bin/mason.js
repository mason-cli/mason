#!/usr/bin/env node

"use strict";

require("babel-core/register", {
  presets: [
    [
      "env",
      {
        targets: {
          node: "current"
        }
      }
    ],
    "stage-0"
  ]
});
require("babel-polyfill");
require("app-module-path").addPath(process.cwd() + "/node_modules");

const fs = require("fs");
const util = require("util");
const path = require("path");

const { Application, Input, Builtins } = require("@mason-cli/core");

var Mason = new Application();
Builtins(Mason);

var config = false;
var standardConfig = `${process.cwd()}/mason.config.js`;
var babelConfig = `${process.cwd()}/mason.babel.js`;
if (fs.existsSync(standardConfig)) {
  config = require(standardConfig);
} else if (fs.existsSync(babelConfig)) {
  config = require(babelConfig).default;
}

if (config) {
  if (typeof config == "function") {
    config = config(Mason);
  }
  Mason.setConfig(config);
} else {
  console.info("WARNING: Mason config not found");
  console.log("");
}

// Load plugins
if (config && config.plugins) {
  config.plugins.forEach(location => {
    if (location.substring(0, 2) == "./" || location.substring(0, 2) == ".\\") {
      location = process.cwd() + path.sep + location.substring(2);
    }

    let plugin = require(location);
    if (plugin) {
      plugin.default(Mason);
    }
  });
}

try {
  var input = new Input(process.argv);
  Mason.run(input.command(), input.all(), config)
    .catch(err => {
      console.error(util.inspect(err, false, null));
    })
    .then(() => {
      process.exit();
    });
} catch (e) {
  console.error("Error!", e.message ? e.message : e);
  if (e.stack) {
    console.log(util.inspect(e.stack, false, null));
  }
}
