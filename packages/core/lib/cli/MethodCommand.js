"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Command = require("./Command");

var _Command2 = _interopRequireDefault(_Command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MethodCommand extends _Command2.default {
    constructor(method) {
        super();
        this.method = method;
    }

    async run(input, conf) {
        return await this.method(input, conf);
    }

    static help() {
        return "Inline commands do not offer help text. " + "Use the Command class instead.";
    }
}
exports.default = MethodCommand;