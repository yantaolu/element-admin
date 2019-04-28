const MarkdownBody = {
  template: `<div class="markdown-body" v-html="html"></div>`,
  props: ['html'],
  methods: {
    getLinks () {
      return Array.from(this.$el.querySelectorAll('a[href]')).filter(a => {
        return new RegExp(`^${a.origin}`).test(a.baseURI)
      })
    },
    updateLinks () {
      this.getLinks().forEach(a => {
        const mode = this.$router.mode
        const href = a.getAttribute('href').replace(/^\/?#/, '')
        if (!/^http/.test(href)) {
          a.setAttribute('href', `${mode === 'hash' ? '#' : ''}${href}`)
          a.onclick = (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.$router.push(href)
          }
        }
      })
    }
  },
  mounted () {
    this.updateLinks()
  },
  updated () {
    this.updateLinks()
  }
}

export default (promise, resolve) => {
  resolve({
    components: {
      MarkdownBody
    },
    data () {
      return {
        html: ''
      }
    },
    render () {
      return (
        <markdown-body html={this.html}></markdown-body>
      )
    },
    async mounted () {
      this.html = await promise
    }
  })
}
