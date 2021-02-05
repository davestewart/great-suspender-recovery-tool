/* global getVisitTime:true, dedupe:true, copyTextToClipboard: true, sortBy: true, getFavIcon2:true */

const app = new Vue({
  el: '#app',

  data: {
    loaded: false,
    items: [],
    message: '',
    promo: true,
    test: true,
    options: {
      mode: 'list',
      groupBy: 'domain',
      sortBy: 'date',
      format: 'data',
      relativeTime: false,
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
          maxResults: 100,
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

    bookmarkData () {

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
        this.message = 'Data copied OK!'
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
