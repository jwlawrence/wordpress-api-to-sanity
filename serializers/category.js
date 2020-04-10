const parseBody = require('../utils/parse-body')
const sanitizeHtml = require('../utils/sanitize-html')

module.exports = function serializeCategory(category) {
  return {
    _id: `category-${category.id}`,
    _type: 'category',
    title: category.name,
    slug: category.slug,
    description: sanitizeHtml(category.description),
  }
}
