import optionsStorage from './options-storage.js';

// Handle extension icon clicks to toggle enabled state
chrome.action.onClicked.addListener(async (tab) => {
	const currentOptions = await optionsStorage.getAll();
	const newEnabledState = !currentOptions.enabled;
	
	// Update the options
	await optionsStorage.set({ enabled: newEnabledState });
	
	// Update the action badge to show state
	chrome.action.setBadgeText({
		text: newEnabledState ? 'ON' : 'OFF',
	});
	chrome.action.setBadgeBackgroundColor({
		color: newEnabledState ? '#4CAF50' : '#F44336',
	});
	
	// Reload the tab to apply changes
	if (tab.id) {
		chrome.tabs.reload(tab.id);
	}
});

// Set initial badge state
chrome.runtime.onStartup.addListener(async () => {
	const options = await optionsStorage.getAll();
	chrome.action.setBadgeText({
		text: options.enabled ? 'ON' : 'OFF',
	});
	chrome.action.setBadgeBackgroundColor({
		color: options.enabled ? '#4CAF50' : '#F44336',
	});
});

// Also update badge when options change
optionsStorage.onChange.addListener(async (changes) => {
	if (changes.enabled !== undefined) {
		chrome.action.setBadgeText({
			text: changes.enabled.newValue ? 'ON' : 'OFF',
		});
		chrome.action.setBadgeBackgroundColor({
			color: changes.enabled.newValue ? '#4CAF50' : '#F44336',
		});
	}
});
