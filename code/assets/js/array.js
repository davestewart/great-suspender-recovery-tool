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

export function getValue (target, path) {
  const props = path.split('.')
  return props.reduce((target, prop) => {
    return target[prop]
  }, target)
}

export function sortBy (prop, numeric = false, order = 'asc') {
  return function (a, b) {
    // values
    a = getValue(a, prop)
    b = getValue(b, prop)

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
