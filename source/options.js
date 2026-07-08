// eslint-disable-next-line import/no-unassigned-import
import 'webext-base-css';
import './options.css';
import optionsStorage from './options-storage.js';

// Sync all form inputs with storage
async function init() {
	await optionsStorage.syncForm('#options-form');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
