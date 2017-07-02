"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Mason command class
 */
var Command = function () {
  function Command(input, conf, runner) {
    _classCallCheck(this, Command);

    if (typeof this.run !== "function") {
      throw "Invalid command. Command must have a run method.";
    }
    this.input = input;
    this.conf = conf;
    this.runner = runner;
    this.run = this.run.bind(this);
  }

  _createClass(Command, null, [{
    key: "help",
    value: function help() {
      console.log("No help text provided for this command");
    }
  }]);

  return Command;
}();

exports.default = Command;