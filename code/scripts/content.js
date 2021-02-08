import { getVisitTime, copyTextToClipboard, plural } from '../assets/js/utils.js'
import { createBookmark, getFavIcon } from '../assets/js/browser.js'
import { dedupe, sortBy } from '../assets/js/array.js'

// query
const params = new URLSearchParams(location.search)
const query = Object.fromEntries(params)

// app
window.app = new Vue({
  el: '#app',

  data: {
    // data
    loaded: false,
    items: [],
    message: '',

    // settings
    promo: params.has('promo'),
    query,

    // options
    options: {
      mode: 'list',
      groupBy: 'domain',
      sortBy: 'date',
      format: 'all',
      relativeTime: true,
    },
  },

  computed: {
    sorted () {
      const prop = this.options.sortBy
      const numeric = ['date', 'visits'].includes(prop)
      const order = numeric ? 'desc' : 'asc'
      return this.items.sort(sortBy(prop, numeric, order))
    },

    grouped () {
      // cache to optimise lookups
      const cache = {}

      // group
      const grouped = this
        .sorted
        .reduce((output, item) => {
          // group
          const title = item[this.options.groupBy]

          // if group not yet created...
          if (!cache[title]) {
            // create group
            const group = {
              title: title,
              time: item.time,
              visits: item.visits,
              items: [],
            }

            // update objects
            cache[title] = group
            output.push(group)
          }

          // add item
          cache[title].items.push(item)

          // return
          return output
        }, [])

      // sorting
      const sortMap = {
        domain: 'title',
        visitsText: 'visits',
        date: 'time',
        relativeTime: 'time',
      }
      const prop = this.options.groupBy
      const propSort = sortMap[prop]
      const numeric = ['visitsText', 'date', 'relativeTime'].includes(prop)
      return numeric
        ? grouped.sort(sortBy(propSort, true, 'desc'))
        : grouped
    },

    showAll () {
      return this.options.format === 'all'
    },

    showData () {
      return ['all', 'data'].includes(this.options.format)
    },
  },

  watch: {
    options: {
      deep: true,
      handler (value) {
        localStorage.setItem('options', JSON.stringify(value))
      },
    },
  },

  created () {
    const options = localStorage.getItem('options')
    if (options) {
      Object.assign(this.options, JSON.parse(options))
    }
  },

  mounted () {
    // search
    this.search()

    // body
    document.body.addEventListener('mousedown', () => {
      this.message = ''
    })
  },

  methods: {
    search () {
      // body
      document.body.classList.remove('loading')

      // query
      const query = {
        text: 'chrome-extension://klbibkeccnjlkjkiokjodocebajanakg/suspended.html',
        startTime: 0,
        maxResults: 10000,
      }

      // custom text
      if (this.query.text) {
        Object.assign(query, {
          text: this.query.text,
          maxResults: Number(this.query.limit || 30),
        })
      }

      // search
      chrome.history.search(query, this.onResults)
    },

    onResults (items) {
      this.items = dedupe(items).map(item => {
        // cleanup
        item.url = item.url.replace(/\/www\./, '/')

        // variables
        const model = new URL(item.url)
        const params = new URLSearchParams(model.hash.substr(1))
        const time = item.lastVisitTime

        // data
        const title = params.get('ttl') || item.title
        const url = params.get('uri') || item.url
        const dateTime = getVisitTime(time)
        const relativeTime = getVisitTime(time, true)
        const visits = item.visitCount

        // return
        return {
          domain: new URL(url).hostname,
          title,
          url,
          visits,
          visitsText: plural(visits, 'visit'),
          dateTime,
          date: dateTime.substring(0, 10),
          relativeTime,
          time: item.lastVisitTime,
        }
      })
      this.loaded = true
    },

    getVisitTime (item) {
      return getVisitTime(item.time, this.options.relativeTime)
    },

    getIcon (item) {
      return getFavIcon(item.url)
    },

    async bookmarkData () {
      // constants
      const bookmarkBarId = '2'
      const rootFolderTitle = 'Recovered Great Suspender Tabs'
      const grouped = this.grouped
      const numGroups = grouped.length
      const numTabs = this.sorted.length

      // remove old folder
      await new Promise(function (resolve, reject) {
        chrome.bookmarks.getChildren(bookmarkBarId, function (bookmarks) {
          const folder = bookmarks.find(bookmark => bookmark.title === rootFolderTitle)
          if (folder) {
            console.log('Removing old folder...')
            chrome.bookmarks.removeTree(folder.id, resolve)
          }
          else {
            resolve()
          }
        })
      })

      // create root folder
      const root = await createBookmark({
        parentId: bookmarkBarId,
        title: rootFolderTitle,
      })

      // loop over groups
      const promises = grouped.map(async function (group) {
        // create group folder
        const folder = await createBookmark({
          parentId: root.id,
          title: group.title,
        })

        // loop over items
        const items = group.items
        const promises = items.map(async function (item) {
          return createBookmark({
            parentId: folder.id,
            title: item.title,
            url: item.url,
          })
        })

        // complete promises
        return Promise.all(promises)
      })

      // alert
      return Promise.all(promises).then(() => {
        this.message = `
          <h5>Recovery complete!</h5>
          <ul>
            <li>Saved ${numTabs} tabs</li>
            <li>Created ${numGroups} folders</li>
            <li>Check "Other Bookmarks/${rootFolderTitle}"</li>
          </ul>
          `
      })
    },

    copyData () {
      // helper
      const getRow = data => Object.values(data).join('\t')

      // copy text
      try {
        // loop over all rows
        const data = this.items.map(item => {
          switch (this.options.format) {
            case 'url':
              return {
                url: item.url,
              }

            case 'data':
              return {
                title: item.title,
                url: item.url,
              }

            case 'all':
            default:
              return {
                visits: item.visits,
                time: getVisitTime(item.time, this.options.relativeTime),
                title: item.title,
                url: item.url,
              }
          }
        })

        // convert data to lines
        const lines = data.map(getRow)

        // prepend headers
        lines.unshift(getRow(Object.keys(data[0])))

        // copy
        copyTextToClipboard(lines.join('\n'))
        this.message = `
          <h5>Data copied OK!</h5>
          <p>You can now paste it into a spreadsheet</p>
          `
      }

      // fail!
      catch (err) {
        console.log(err)
        this.message = 'Unable to copy data. Try selecting and copying instead!'
      }
    },
  },
})
