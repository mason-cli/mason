"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Mason command class
 */
var Command = function Command(input, conf, runner) {
  _classCallCheck(this, Command);

  if (typeof this.run !== 'function') {
    throw "Invalid command. Command must have a run method.";
  }
  this.run = this.run.bind(this);
  this.input = input;
  this.conf = conf;
  this.runner = runner;
};

exports.default = Command;