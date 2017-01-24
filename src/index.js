'use strict';

import CommandRunner from './cli/CommandRunner'

const Mason = new CommandRunner();
import builtins from './cli/Builtins'
builtins(Mason);

export default Mason;