export function timeAgo (time) {
  const ms = Date.now() - time
  let ago = Math.floor(ms / 1000)
  let part = 0

  if (ago < 7200) {
    return '1 hour ago'
  }
  if (ago < 86400) {
    while (ago >= 3600) {
      ago -= 3600
      part += 1
    }
    return part + ' hours ago'
  }

  if (ago < 172800) {
    return '1 day ago'
  }
  if (ago < 604800) {
    while (ago >= 172800) {
      ago -= 172800
      part += 1
    }
    return part + ' days ago'
  }

  if (ago < 1209600) {
    return '1 week ago'
  }
  if (ago < 2592000) {
    while (ago >= 604800) {
      ago -= 604800
      part += 1
    }
    return part + ' weeks ago'
  }

  if (ago < 5184000) {
    return '1 month ago'
  }
  if (ago < 31536000) {
    while (ago >= 2592000) {
      ago -= 2592000
      part += 1
    }
    return part + ' months ago'
  }

  if (ago < 1419120000) { // 45 years, approximately the epoch
    return 'more than year ago'
  }

  // TODO pass in Date.now() and ms to check for 0 as never
  return 'never'
}

export function getVisitTime (timestamp, relative) {
  return relative
    ? timeAgo(timestamp)
    : new Date(timestamp).toISOString().substr(0, 19).replace(/[TZ]/g, ' ')
}

export function copyTextToClipboard (text) {
  // Create a textbox field where we can insert text to.
  const copyFrom = document.createElement('textarea')

  // Set the text content to be the text you wished to copy.
  copyFrom.textContent = text

  // Append the textbox field into the body as a child.
  // "execCommand()" only works when there exists selected text, and the text is inside
  // document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom)

  // Select all the text!
  copyFrom.select()

  // Execute command
  document.execCommand('copy')

  // (Optional) De-select the text using blur().
  copyFrom.blur()

  // Remove the textbox field from the document.body, so no other JavaScript nor
  // other elements can get access to this.
  document.body.removeChild(copyFrom)
}
