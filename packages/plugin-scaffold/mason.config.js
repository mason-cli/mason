module.exports = {
	plugins: ['./lib/index.js'],
	scaffold: {
		templates: {
			'example': {source:'./example/in.txt',destination:'./example/out'}
		},
		definitions: {
			foo: 'ConfigForFoo'
		},
		destination_path: 'example'
	}
};