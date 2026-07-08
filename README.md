# HTML5 Form Validation Remover

A Chrome extension that removes HTML5 form validation messages and allows form submission without validation constraints.

## Features

- **Manifest V3 Compliant**: Fully compatible with Chrome's Manifest V3 requirements
- **Removes HTML5 validation**: Disables browser-native form validation
- **Multiple removal methods**:
  - Adds `novalidate` attribute to all forms
  - Prevents the `invalid` event from showing validation UI
  - Removes validation message elements from the DOM
  - Hides validation bubbles via CSS
- **Configurable**: Enable/disable each removal method via options page
- **Toggle via icon**: Click the extension icon to enable/disable quickly

## Installation

### Development

1. Clone the repository:
   ```bash
   git clone https://github.com/dalexandre/HTML5-Form-validation-remover.git
   cd HTML5-Form-validation-remover
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `distribution` folder

### From Chrome Web Store

*Coming soon - extension needs to be published*

## Usage

Once installed, the extension automatically removes HTML5 form validation from all web pages.

### Toggle Extension

Click the extension icon in the toolbar to enable or disable the extension. The badge will show:
- **ON** (green) when enabled
- **OFF** (red) when disabled

### Configure Options

1. Right-click the extension icon
2. Select "Options"
3. Configure which validation removal methods to use:
   - **Enable Extension**: Master switch
   - **Add novalidate attribute to forms**: Adds `novalidate` to form elements
   - **Prevent invalid event**: Stops the browser from showing validation popups
   - **Remove validation messages**: Actively removes validation elements from DOM

## How It Works

### 1. Novalidate Attribute
The extension adds the `novalidate` attribute to all `<form>` elements on the page:
```html
<form novalidate>
  <!-- form fields -->
</form>
```
This tells the browser not to perform HTML5 validation on form submission.

### 2. Invalid Event Prevention
The extension listens for the `invalid` event in the capture phase and calls `preventDefault()`:
```javascript
document.addEventListener('invalid', function(event) {
  event.preventDefault();
  event.target.setCustomValidity('');
}, true);
```
This prevents the browser from showing its native validation popup.

### 3. CSS Hiding
The extension injects CSS to hide validation bubbles:
```css
::-webkit-validation-bubble {
  display: none !important;
}
:invalid {
  box-shadow: none !important;
}
```

### 4. Dynamic Content
A MutationObserver watches for new form elements added to the DOM and applies the same treatments.

## Compatibility

- **Chrome**: 88+ (Manifest V3)
- **Firefox**: Supported via browser-specific settings
- **Edge**: Supported (Manifest V3)
- **Brave**: Supported (Manifest V3)

## Migration from Manifest V2

This extension is built on **Manifest V3**, which is required by Chrome starting August 31, 2026. All Manifest V2 extensions will be removed from the Chrome Web Store on that date.

### Key Changes from V2 to V3:

1. **Service Worker**: Replaces background pages
2. **Declarative APIs**: For network requests (not used in this extension)
3. **Permissions**: More granular permission controls
4. **Remote Code**: Restricted execution of remote code

This extension is fully compliant with Manifest V3 requirements.

## Development

### Commands

- `npm run build` - Build the extension to `distribution/` folder
- `npm run watch` - Watch for changes and rebuild automatically
- `npm run lint` - Run linters
- `npm run lint:fix` - Fix linting issues
- `npm test` - Run all linters and build

### Project Structure

```
source/
├── manifest.json          # Extension manifest (V3)
├── background.js          # Service worker (background script)
├── content.js             # Content script (injected into pages)
├── content.css            # Styles for content script
├── options.html           # Options page
├── options.js             # Options page script
├── options.css            # Options page styles
└── options-storage.js     # Options management with webext-options-sync

distribution/             # Built extension files (generated)
```

### Dependencies

- [Parcel 2](https://parceljs.org/) - Bundler
- [webext-options-sync](https://github.com/fregante/webext-options-sync) - Sync options across tabs
- [webext-base-css](https://github.com/fregante/webext-base-css) - Base styles for options page

## License

MIT License - see LICENSE file for details.

## Credits

- Icon: [Freepik](https://www.freepik.com) from [Flaticon](https://www.flaticon.com)
- Template: [fregante/browser-extension-template](https://github.com/fregante/browser-extension-template)
