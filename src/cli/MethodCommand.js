"use strict";

import Command from "./Command";

export default class MethodCommand extends Command {
    constructor(method, input, conf, runner) {
        super(input, conf, runner);

        this.method = method;
    }

    run(resolve, reject) {
        this.method(this.input, this.conf, this.runner, resolve, reject);
    }
}
