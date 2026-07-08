import OptionsSync from 'webext-options-sync';

const optionsStorage = new OptionsSync({
	defaults: {
		enabled: true,
		removeValidationMessages: true,
		addNovalidateAttribute: true,
		preventInvalidEvent: true,
	},
	migrations: [
		OptionsSync.migrations.removeUnused,
	],
	logging: true,
});

export default optionsStorage;
