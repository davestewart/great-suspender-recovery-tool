# The Great Suspender Recovery Tool

> Recover your lost Great Suspender tabs!

![screenshot](artwork/screenshot-list.png)

## Intro

This extension attempts to recover your suspended Great Suspender tabs by searching your browser history and displaying any found suspended tabs.

You can then:

- adjust grouping, sorting and detail
- save as folders and bookmarks
- copy URLs to the clipboard


## Installation

### Manual installation

Until the extension is in the app store, you can "side load" it using developer settings:

1. Clone or download this repository to your local hard drive
2. Open Chrome and go Settings > More Tools > Extensions
3. Toggle on the "Developer mode" switch top right
4. Click the "Load unpacked" button top left
5. Navigate to the extension's `code/` folder
6. Click to confirm the folder choice


### Installation from the Chrome Web Store

1. Go to the Chrome Web Store
2. Visit this URL (TBC)
3. Click "Add to Chrome"


## Instructions

Running the extension:

1. Run the extension by clicking on the toolbar icon: ![icon](src/assets/icons/icon-16.png)

Saving as bookmarks:

1. Make sure the "display" option is set to "List"
2. Adjust the settings and preview the output
3. Click "Bookmark Tabs"
4. Check the new folder at "Other Bookmarks/Recovered Great Suspender Tabs"

Copying to a spreadsheet:

1. Make sure the "display" option is set to "Table"
2. Adjust the settings and preview the output
3. Click "Copy to Clipboard"
4. Paste into a spreadsheet

## Running in test mode

If you don't have any Great Suspender tabs saved, you can check the extension works by appending the following query to the URL:

```
?test=1
```

## Development

The extension is not currently compiled, but there is a build process.

Install as usual:

```bash
npm i
```


Run the release script:

```bash
npm run release
```

This will release to a folder called `releases` one level above the repository root.
