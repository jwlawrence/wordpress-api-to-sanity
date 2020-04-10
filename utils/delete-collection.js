const sanityClient = require('./sanity-client')
const args = process.argv.slice(2) || ''

if (!args[0]) {
  return console.error(
    'A document type must be provided as an argument. ex. `node delete-collection.js post`',
  )
}

sanityClient
  .delete({ query: `*[_type == "${args[0]}"]` })
  .then(console.log)
  .catch(console.error)
