# HTML5 Form Validation Remover

A Chrome extension that removes HTML5 form validation messages and allows form submission without validation constraints.

## Features

- **Manifest V3 Compliant**: Fully compatible with Chrome's Manifest V3 requirements
- **Removes HTML5 validation**: Disables browser-native form validation
- **On-demand activation**: **Does nothing until you click the icon** - respects user privacy
- **Multiple removal methods**:
  - Adds `novalidate` attribute to all forms
  - Prevents the `invalid` event from showing validation UI
  - Removes validation message elements from the DOM
  - Hides validation bubbles via CSS
- **Configurable**: Enable/disable each removal method via options page
- **Minimal permissions**: Only requests `activeTab`, `scripting`, `storage`, and `notifications`

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

**The extension does NOTHING by default.** It only activates when you explicitly click the icon.

### Activate on Current Page

1. Navigate to any webpage with HTML5 form validation
2. Click the extension icon in the Chrome toolbar
3. The extension injects the necessary code to remove validation on **that page only**
4. A notification confirms activation

### Configure Options

You can customize which validation removal methods are used:

1. Right-click the extension icon
2. Select "Options"
3. Configure the methods:
   - **Enable extension globally**: Master switch. When disabled, clicking the icon does nothing.
   - **Add novalidate attribute to forms**: Adds `novalidate` to all form elements on the page
   - **Prevent invalid event**: Stops the browser from showing validation popups
   - **Remove validation messages**: Actively removes validation elements from the DOM

### Per-Page Activation

Each time you click the icon, the extension activates on the **current page only**. It does not:
- Run on all pages automatically
- Modify pages you haven't clicked on
- Track your browsing activity
- Require `<all_urls>` permission

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
- **Firefox**: Supported via browser-specific settings (gecko.id configured)
- **Edge**: Supported (Manifest V3)
- **Brave**: Supported (Manifest V3)

## Privacy

This extension is designed with privacy in mind:

- **No persistent content scripts**: Code is injected only when you click the icon
- **No `<all_urls>` permission**: Does not have access to all your web activity
- **No background tracking**: Only uses `activeTab` permission for the current tab
- **On-demand only**: Completely inactive until you explicitly use it
- **No data collection**: Does not send any data to external servers

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
