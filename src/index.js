'use strict';

import CommandRunner from './cli/CommandRunner'
import Command from './cli/Command'
import Arguments from './cli/Arguments'

const Mason = new CommandRunner();
import builtins from './cli/Builtins'
builtins(Mason);

module.exports.Mason = Mason;
module.exports.Command = Command;
module.exports.CommandRunner = CommandRunner;
module.exports.Arguments = Arguments;