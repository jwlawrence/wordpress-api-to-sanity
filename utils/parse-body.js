const { JSDOM } = require('jsdom')
const blockTools = require('@sanity/block-tools').default
const sanitizeHTML = require('./sanitize-html')
const defaultSchema = require('./schema')

function htmlToBlocks(html, options) {
  if (!html) {
    return []
  }

  // The compiled schema type for the content type that holds the block array
  const blockContentType = defaultSchema
    .get('blogPost')
    .fields.find(field => field.name === 'body').type

  const blocks = blockTools.htmlToBlocks(sanitizeHTML(html), blockContentType, {
    parseHtml: htmlContent => new JSDOM(htmlContent).window.document,
    rules: [
      {
        deserialize(el, next, block) {
          // Special case for code blocks (wrapped in pre and code tag)
          if (el.tagName.toLowerCase() !== 'pre') {
            return undefined
          }
          const code = el.children[0]
          let text = ''
          if (code) {
            const childNodes =
              code && code.tagName.toLowerCase() === 'code'
                ? code.childNodes
                : el.childNodes
            childNodes.forEach(node => {
              text += node.textContent
            })
          } else {
            text = el.textContent
          }
          if (!text) {
            return undefined
          }
          return block({
            children: [],
            _type: 'code',
            text: text,
          })
        },
      },
      {
        deserialize(el, next, block) {
          if (el.tagName === 'IMG') {
            const asset = block({
              children: [],
              _type: 'image',
              _sanityAsset: `image@${el
                .getAttribute('src')
                .replace(/^\/\//, 'https://')}`,
            })

            return asset
          }

          if (
            el.tagName.toLowerCase() === 'p' &&
            el.childNodes.length === 1 &&
            el.childNodes.tagName &&
            el.childNodes[0].tagName.toLowerCase() === 'img'
          ) {
            return block({
              _sanityAsset: `image@${el.childNodes[0]
                .getAttribute('src')
                .replace(/^\/\//, 'https://')}`,
            })
          }
          // Only convert block-level images, for now
          return undefined
        },
      },
    ],
  })
  return blocks
}

module.exports = bodyHTML => htmlToBlocks(bodyHTML)
