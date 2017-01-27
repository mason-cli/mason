import Command from './Command'

/**
 * Internal plugin to register all built-in Mason commands
 * @param  {Mason} Mason The Mason instance
 * @return {void}
 */
export default (Mason) => {
	class VersionCommand extends Command {
		static get description() {
			return 'Displays the current Mason build version';
		}

		run(resolve, reject) {
			console.log('Mason version: ' + Mason.version());
			resolve();
		}
	}

	class HelpCommand extends Command {
		static get description() {
			return 'Displays this help text';
		}

		run(resolve, reject) {
			if(this.input.args.length) {
				let cmd = this.input.args[0];
				let command = this.runner.getCommand(cmd, true);
				if(command) {
					console.log('Mason - ' + cmd + ' Help');
					console.log('---------------------------');
					command.help();
					console.log('---------------------------');

					return;
				}
			}

			console.log('Mason - Available Commands');
			console.log('---------------------------');
			this.runner.commands.forEach((cmd,name) => {
				console.log(name + ': ' + (cmd.description ? cmd.description : '(no description provided)'));
			});
			console.log('---------------------------');
			resolve();
		}
	}

	Mason.registerCommand('help', HelpCommand);
	Mason.registerCommand('version', VersionCommand);
};