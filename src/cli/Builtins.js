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
			console.log('Mason version 1.0.0');
			resolve();
		}
	}

	class HelpCommand extends Command {
		static get description() {
			return 'Displays this help text';
		}

		run(resolve, reject) {
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