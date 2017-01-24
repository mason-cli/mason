import Command from './Command'

export default (Mason) => {
	class VersionCommand extends Command {
		run(resolve, reject) {
			console.log('Mason version 1.0.0');
			resolve();
		}
	}

	class HelpCommand extends Command {
		run(resolve, reject) {
			console.log('Mason - Available Commands');
			console.log('---------------------------');
			console.log('help: This help text');
			console.log('version: Get the current Mason version');
			console.log('---------------------------');
			resolve();
		}
	}

	Mason.registerCommand('help', HelpCommand);
	Mason.registerCommand('version', VersionCommand);
};