import optionsStorage from './options-storage.js';

// The CSS to inject
const VALIDATION_REMOVER_CSS = `
	/* Hide HTML5 validation bubbles */
	:invalid {
		box-shadow: none !important;
	}

	/* Hide WebKit validation bubble */
	::-webkit-validation-bubble,
	::-webkit-validation-bubble-arrow,
	::-webkit-validation-bubble-heading,
	::-webkit-validation-bubble-message {
		display: none !important;
	}

	/* Hide Firefox validation message */
	:invalid:-moz-ui-invalid {
		box-shadow: none !important;
	}

	/* Remove outline from invalid fields */
	input:invalid, textarea:invalid, select:invalid {
		outline: none !important;
		box-shadow: none !important;
	}

	/* Hide any custom validation messages */
	[role="alert"][aria-live="assertive"] {
		display: none !important;
	}
`;

// Inject the content script and CSS into the active tab when the action is clicked
chrome.action.onClicked.addListener(async tab => {
	if (!tab.id) {
		return;
	}

	try {
		// Show temporary badge to confirm click
		chrome.action.setBadgeText({text: '\u2713'}); // Checkmark symbol
		chrome.action.setBadgeBackgroundColor({color: '#4CAF50'}); // Green

		// Get current options to know what to inject
		const currentOptions = await optionsStorage.getAll();

		// Inject CSS first
		await chrome.scripting.insertCSS({
			target: {tabId: tab.id},
			css: VALIDATION_REMOVER_CSS,
		});

		// Inject JavaScript
		await chrome.scripting.executeScript({
			target: {tabId: tab.id},
			func: removeValidation,
			args: [currentOptions],
		});

		// Show a notification to confirm
		chrome.notifications.create({
			type: 'basic',
			iconUrl: 'icon.png',
			title: 'HTML5 Form Validation Remover',
			message: 'Validation removal activated on this page.',
		});

		// Remove badge after 2 seconds
		setTimeout(() => {
			chrome.action.setBadgeText({text: ''});
		}, 2000);
	} catch (error) {
		console.error('Failed to inject scripts:', error);
		chrome.action.setBadgeText({text: 'X'});
		chrome.action.setBadgeBackgroundColor({color: '#F44336'}); // Red
		chrome.notifications.create({
			type: 'basic',
			iconUrl: 'icon.png',
			title: 'Error',
			message: `Failed to activate: ${error.message}`,
		});
		setTimeout(() => {
			chrome.action.setBadgeText({text: ''});
		}, 2000);
	}
});

// The actual validation removal logic (will be injected into the page)
function removeValidation(passedOptions) {
	const DEFAULT_OPTIONS = {
		enabled: true,
		removeValidationMessages: true,
		addNovalidateAttribute: true,
		preventInvalidEvent: true,
	};

	const currentOptions = {...DEFAULT_OPTIONS, ...passedOptions};

	if (!currentOptions.enabled) {
		return;
	}

	// Add novalidate attribute to all forms
	if (currentOptions.addNovalidateAttribute) {
		const forms = document.querySelectorAll('form:not([novalidate])');
		for (const form of forms) {
			form.setAttribute('novalidate', 'novalidate');
		}
	}

	// Prevent the invalid event from showing validation UI
	if (currentOptions.preventInvalidEvent) {
		document.addEventListener('invalid', event => {
			event.preventDefault();
			const target = event.target;
			if (target && target.setCustomValidity) {
				target.setCustomValidity('');
			}
		}, true);
	}

	// Remove validation messages
	if (currentOptions.removeValidationMessages) {
		const validationMessages = document.querySelectorAll('.validation-message, [role="alert"]');
		for (const message of validationMessages) {
			message.remove();
		}

		const elementsWithDataAttributes = document.querySelectorAll('[data-validation-message], [x-moz-errormessage]');
		for (const element of elementsWithDataAttributes) {
			delete element.dataset.validationMessage;
			delete element.dataset.mozErrormessage;
		}

		// Observe for dynamically added content
		const observer = new MutationObserver(mutations => {
			for (const mutation of mutations) {
				if (mutation.addedNodes.length > 0) {
					if (currentOptions.addNovalidateAttribute) {
						const newForms = document.querySelectorAll('form:not([novalidate])');
						for (const newForm of newForms) {
							newForm.setAttribute('novalidate', 'novalidate');
						}
					}

					if (currentOptions.removeValidationMessages) {
						const newMessages = document.querySelectorAll('.validation-message, [role="alert"]');
						for (const newMessage of newMessages) {
							newMessage.remove();
						}
					}
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	console.log('HTML5 Form Validation Remover activated with options:', currentOptions);
}
