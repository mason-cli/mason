'use strict';

import CommandRunner from './cli/CommandRunner'
import Command from './cli/Command'
import Arguments from './cli/Arguments'

const Mason = new CommandRunner();
import builtins from './cli/Builtins'
builtins(Mason);

export default {
	Mason: Mason,
	Command: Command,
	CommandRunner: CommandRunner,
	Arguments: Arguments
};