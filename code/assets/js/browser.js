export function getFavIcon2 (pageUrl, size = 32) {
  return `chrome://favicon2/?size=${size}&page_url=${pageUrl}&allow_google_server_fallback=1`
}

export function getFavIcon (pageUrl, size = 32) {
  return `chrome://favicon/size/${size}/${pageUrl}`
}

export function createBookmark (info) {
  return new Promise(function (resolve, reject) {
    chrome.bookmarks.create(info, function (bookmark) {
      arguments.length === 0 && chrome.runtime.lastError
        ? reject(chrome.runtime.lastError.message)
        : resolve(bookmark)
    })
  })
}
