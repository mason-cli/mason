import Command from '../../lib/cli/Command'

class TestCommand extends Command {
	run(resolve, reject) {
		console.log('Test!');
		resolve();
	}
}

export default (Mason) => {
	Mason.registerCommand('test', TestCommand);
};