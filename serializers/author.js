const parseBody = require('../utils/parse-body')
const sanitizeHtml = require('../utils/sanitize-html')

module.exports = function serializeAuthor(author) {
  return {
    _id: `author-${author.id}`,
    _type: 'author',
    title: author.name || '',
    slug: author.slug,
    description: sanitizeHtml(author.description),
  }
}
