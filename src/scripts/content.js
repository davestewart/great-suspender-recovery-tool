/* global getVisitTime:true, dedupe:true, copyTextToClipboard: true */

const app = new Vue({
  el: '#app',

  data: {
    loaded: false,
    items: [],
    message: '',
    promo: false,
    test: true,
    options: {
      format: 'data',
      relativeTime: false,
      sort: 'time',
    },
  },

  computed: {
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
        // variables
        const url = new URL(item.url)
        const params = new URLSearchParams(url.hash.substr(1))
        const time = item.lastVisitTime

        // data
        return {
          title: params.get('ttl') || item.title,
          url: params.get('uri') || item.url,
          time,
          count: item.visitCount,
        }
      })
      this.loaded = true
    },

    getVisitTime (item) {
      return getVisitTime(item.time, this.options.relativeTime)
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
