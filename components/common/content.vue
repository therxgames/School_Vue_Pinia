<script>
  import cheerio from 'cheerio';
  import CommonAudio from './audio.vue';

  const MATH_TYPE_REG = /\sMathType@MTEF[^<>]*@\s/g;

  export default {
    props: {
      content: {type: String, default: ''},
      components: {type: Object, default: null}
    },
    methods: {
      processAttrs(attrs) {
        const newAttrs = {};

        for (const name in attrs) {
          newAttrs[name] = attrs[name];
        }

        return newAttrs;
      },
      renderElements(els) {
        return els.map((el) => this.renderElement(el));
      },
      renderElement(el) {
        if (el.type === 'tag') {
          const name = el.name.toLowerCase();

          if (name === 'audio') {
            let src;

            if (el.attribs?.src) {
              src = el.attribs.src;
            } else if (el.children[0]?.name === 'source' && el.children[0].attribs?.src) {
              src = el.children[0].attribs?.src;
            }

            return h(CommonAudio, {src});
          } else if (this.components && this.components[name]) {
            return (this.components[name](el));
          } else {
            return h(name, el.attribs, this.renderElements(el.children));
          }
        } else if (el.type === 'text') {
          return el.data;
        }
      }
    },
    render() {
      let content = this.content;

      while (content.match(MATH_TYPE_REG)) {
        content = content.replace(MATH_TYPE_REG, '')
      }

      const root = cheerio.load(content)('body')[0];
      return h('div', {class: 'commonContent'}, this.renderElements(root.children));
    }
  };
</script>

<style lang="scss">
  .commonContent {
    table {
      font-size: 12px;
      background-color: #fff;

      & > :not(caption) > * > * {
        border-width: 1px;
      }

      tbody {
        border-width: 1px;
      }

      td {
        padding: 0.5rem;
      }

      p {
        margin-bottom: 0;
      }

      br[clear='all'] {
        display: none;
      }
    }

    .MsoNormal:empty {
      display: none;
    }
  }
</style>
