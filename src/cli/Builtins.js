import Command from './Command'

export default (Mason) => {
	class VersionCommand extends Command {
		get description() {
			return 'Displays the current Mason build version';
		}

		run(resolve, reject) {
			console.log('Mason version 1.0.0');
			resolve();
		}
	}

	class HelpCommand extends Command {
		get description() {
			return 'Displays this help text';
		}

		run(resolve, reject) {
			console.log('Mason - Available Commands');
			console.log('---------------------------');
			this.runner.commands.forEach((name,cmd) => {
				console.log(name + ': ' + (cmd.description || '(no description provided)'));
			});
			console.log('---------------------------');
			resolve();
		}
	}

	Mason.registerCommand('help', HelpCommand);
	Mason.registerCommand('version', VersionCommand);
};