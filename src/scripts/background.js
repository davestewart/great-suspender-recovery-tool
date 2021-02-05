chrome.browserAction.onClicked.addListener(() => {
  chrome.windows.create({
    url: chrome.runtime.getURL('index.html'),
  })
})
