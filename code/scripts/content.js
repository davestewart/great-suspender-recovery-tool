/*
  global getVisitTime:true,
  dedupe:true,
  sortBy: true,
  copyTextToClipboard: true,
  getFavIcon:true,
  createBookmark: true,
*/

const isTest = location.search.includes('test')
const isPromo = location.search.includes('promo')

const app = new Vue({
  el: '#app',

  data: {
    loaded: false,
    items: [],
    message: '',
    promo: !isTest || isPromo,
    test: isTest,
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
      const numeric = ['time', 'count'].includes(prop)
      const order = prop === 'count' ? 'desc' : 'asc'
      return this.items.sort(sortBy(prop, numeric, order))
    },

    grouped () {
      return this
        .sorted
        .reduce((output, item) => {
          // group
          const group = item[this.options.groupBy]
          if (!output[group]) {
            output[group] = []
          }

          // add item
          output[group].push(item)

          // return
          return output
        }, {})
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
      // query
      const query = {
        text: 'chrome-extension://klbibkeccnjlkjkiokjodocebajanakg/suspended.html',
        startTime: 0,
        maxResults: 10000,
      }

      // test
      if (this.test) {
        Object.assign(query, {
          text: 'a',
          maxResults: 30,
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

        // return
        return {
          domain: new URL(url).hostname,
          title,
          url,
          count: item.visitCount,
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
      const numGroups = Object.keys(grouped).length
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
      const promises = Object.keys(grouped).map(async function (key) {
        // create group folder
        const folder = await createBookmark({
          parentId: root.id,
          title: key,
        })

        // loop over items
        const items = grouped[key]
        const promises = items.map(async function (item) {
          return await createBookmark({
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
              return item.url

            case 'data':
              return getRow({
                title: item.title,
                url: item.url,
              })

            case 'all':
            default:
              return getRow({
                count: item.count,
                time: getVisitTime(item.time, this.options.relativeTime),
                title: item.title,
                url: item.url,
              })
          }
        })

        // copy
        copyTextToClipboard(data.join('\n'))
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

console.log(app)
