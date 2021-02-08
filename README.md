# The Great Suspender Recovery Tool

> Recover your lost Great Suspender tabs!

![screenshot](artwork/screenshot-list.png)

## Intro

This extension attempts to recover your suspended Great Suspender tabs by searching your browser history and displaying any found suspended tabs.

You can then:

- browse as a [nested list](artwork/screenshot-list.png) or a [table](artwork/screenshot-table.png)
- adjust grouping, sorting and level of detail
- save as [folders and bookmarks](artwork/screenshot-bookmarks.png)
- or copy data to spreadsheet


## Installation

### Manual installation

Until the extension is in the app store, you can "side load" it using developer settings:

1. [Download](https://github.com/davestewart/great-suspender-recovery-tool/releases/latest) the latest release and unzip the file
2. Open Chrome and go **Settings > More Tools > Extensions**
3. Toggle on the **Developer mode** switch top right
4. Click the **Load unpacked** button top left
5. Navigate to the extension's `code/` folder (the one with the `manifest.json` file!)
6. Click to confirm the folder choice


### Installation from the Chrome Web Store

1. Go the extensions's Chrome Web Store [page](https://chrome.google.com/webstore/detail/great-suspender-recovery/ainlmpkfinfbbgdpimmldfdgpenmclmk) *(this won't work yet)*
2. Click "Add to Chrome"


## Instructions

Running the extension:

1. Run the extension by clicking on the toolbar icon: ![icon](code/assets/icons/icon-16.png)

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


## Are you looking for a new tab manager?

[![control space](http://controlspace.app/images/mail/header.png)](http://controlspace.app)

Now that The Great Suspender has been removed from the Chrome Web Store,
perhaps you need a replacement?

[Control Space](http://controlspace.app) is a soon-to-be-released tab manager designed for tab-hoarders and tab-haters alike, which lets you browse, organise, search and switch tabs with one simple shortcut.

It's smooth and fast, yet brimming with features:

- it's an actual, ***actual*** tab manager
- see open, closed and saved tabs **in once place**
- **search and filter** like a boss
- **drag and drop** everything
- completely **keyboard navigable**
- **website integrations** + tools (including sleeping tabs!)
- lots of other **awesome** shit

[Click here to sign up to early access](http://controlspace.app)🤘


## Did you find this tool useful?

An upvote on Product Hunt is always appeciated:

<a href="https://www.producthunt.com/posts/the-great-suspender-recovery-tool?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-the-great-suspender-recovery-tool" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=283498" alt="The Great Suspender Recovery Tool - Recover your lost Great Suspender tabs | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

Thank you!


## Development

### Running in test mode

If you don't have any Great Suspender tabs saved, you can check the extension works by adding a manual query to the URL:

```
?text=hello&limit=100
```

### Scripts

The extension is not currently compiled, but there is a build / release process.

To install the packages:

```bash
npm i
```

Before releasing, modify the `src/manifest` version:

```txt
{
  "version": "1.0.0",
}
```


Then run the release script:

```bash
npm run release
```

This will release to a folder called `releases` one level above the repository root.
