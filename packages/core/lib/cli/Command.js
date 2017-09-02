"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Mason command class
 */
class Command {
    constructor() {
        if (typeof this.run !== "function") {
            throw "Invalid command. Command must have a run method.";
        }
        this.run = this.run.bind(this);
    }

    static help() {
        console.log("No help text provided for this command");
    }
}
exports.default = Command;