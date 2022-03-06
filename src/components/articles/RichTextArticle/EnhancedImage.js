
import Image from '@tiptap/extension-image'

export default Image.extend({
  inline () {
    return true
  },

  group () {
    return 'inline'
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      isSymbol: {
        default: false,
        parseHTML: element => element.getAttribute('data-is-symbol') === 'true',
        renderHTML: attributes => {
          return attributes.isSymbol === true 
                ? {'data-is-symbol': 'true'}
                : {}
        },
      },
    }
  },
})