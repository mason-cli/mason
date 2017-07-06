"use strict";

import Command from "./Command";

export default class MethodCommand extends Command {
    constructor(method) {
        super();
        this.method = method;
    }

    async run(input, conf) {
        return await this.method(input, conf);
    }

    static help() {
        return (
            "Inline commands do not offer help text. " +
            "Use the Command class instead."
        );
    }
}
