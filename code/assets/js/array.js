export function dedupe (items) {
  const cache = {}
  return items
    // skip dupes
    .reduce((results, item) => {
      const url = item.url
      if (!cache[url]) {
        results.push(item)
        cache[url] = true
      }
      return results
    }, [])
}

export function sortBy (prop, numeric = false, order = 'asc') {
  return function (a, b) {
    // values
    a = a[prop]
    b = b[prop]

    // order
    if (order === 'desc') {
      const t = a
      a = b
      b = t
    }

    // sort
    if (a > b) {
      return 1
    }
    if (a < b) {
      return -1
    }
    return 0
  }
}
