import optionsStorage from './options-storage.js';

console.log('HTML5 Form Validation Remover loaded for', chrome.runtime.getManifest().name);

// Default options
const DEFAULT_OPTIONS = {
	enabled: true,
	removeValidationMessages: true,
	addNovalidateAttribute: true,
	preventInvalidEvent: true
};

// Remove HTML5 validation messages
function removeValidationMessages() {
	// Remove existing validation bubbles
	const validationMessages = document.querySelectorAll('.validation-message, [role="alert"]');
	validationMessages.forEach(msg => msg.remove());

	// Remove HTML5 validation popups
	const popups = document.querySelectorAll('::-webkit-validation-bubble');
	// Note: ::-webkit-validation-bubble cannot be removed via JS, but we can prevent it
	
	// Remove custom validation messages from elements
	document.querySelectorAll('[data-validation-message], [x-moz-errormessage]').forEach(el => {
		el.removeAttribute('data-validation-message');
		el.removeAttribute('x-moz-errormessage');
	});
}

// Add novalidate attribute to all forms
function addNovalidateToForms() {
	document.querySelectorAll('form:not([novalidate])').forEach(form => {
		form.setAttribute('novalidate', 'novalidate');
	});
}

// Prevent the invalid event from showing validation UI
function setupInvalidEventPrevention() {
	document.addEventListener('invalid', function(event) {
		event.preventDefault();
		// Remove the validation message
		const target = event.target;
		if (target && target.setCustomValidity) {
			target.setCustomValidity('');
		}
	}, true); // Use capture phase to intercept before browser handles it
}

// Main initialization
async function init() {
	let options = DEFAULT_OPTIONS;
	
	try {
		const storedOptions = await optionsStorage.getAll();
		options = { ...DEFAULT_OPTIONS, ...storedOptions };
	} catch (error) {
		console.log('Using default options:', error);
	}

	if (!options.enabled) {
		console.log('HTML5 Form Validation Remover is disabled');
		return;
	}

	console.log('HTML5 Form Validation Remover is enabled with options:', options);

	// Apply all remover techniques
	if (options.addNovalidateAttribute) {
		addNovalidateToForms();
	}

	if (options.preventInvalidEvent) {
		setupInvalidEventPrevention();
	}

	if (options.removeValidationMessages) {
		removeValidationMessages();
		// Also observe for dynamically added content
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.addedNodes.length) {
					if (options.addNovalidateAttribute) {
						document.querySelectorAll('form:not([novalidate])').forEach(form => {
							form.setAttribute('novalidate', 'novalidate');
						});
					}
					if (options.removeValidationMessages) {
						removeValidationMessages();
					}
				}
			});
		});
		
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: false,
			characterData: false
		});
	}

	// Handle form submissions to ensure they can be submitted
	document.addEventListener('submit', function(event) {
		// The form should be able to submit even if invalid
		// The novalidate attribute should handle this, but just in case
	}, true);

	// Also check for existing forms on page load
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			if (options.addNovalidateAttribute) {
				addNovalidateToForms();
			}
		});
	} else {
		if (options.addNovalidateAttribute) {
			addNovalidateToForms();
		}
	}
}

// Initialize when content script loads
init();
