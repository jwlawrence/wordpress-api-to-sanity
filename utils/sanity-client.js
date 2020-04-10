require('dotenv').config()
const sanityClient = require('@sanity/client')

/**
 * This is useful if you want to use the API rather than the CLI to mutate records in Sanity
 */
module.exports = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN, // we need this to get write access
  useCdn: false, // We can't use the CDN for writing
})
