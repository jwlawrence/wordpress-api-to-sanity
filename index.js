require('dotenv').config()
const fetch = require('node-fetch')
const fs = require('fs')
const serializerFileNames = fs.readdirSync('./serializers/')

/**
 * Fetch and serialize data for each file in the serializers folder
 */
serializerFileNames.forEach(async function(serializerFileName) {
  // Remove the extension from the filename and uppercase it
  const serializerName = serializerFileName
    .replace(/\.[^/.]+$/, '')
    .toUpperCase()

  // Grab the endpoint URL from the .env file
  const endpointUrl = process.env[`${serializerName}_ENDPOINT`]

  // Get the serializer for the record type
  const recordSerializer = require(`./serializers/${serializerFileName}`)

  // Fetch the data from WP, serialize it, log it to the console
  try {
    const rawRecords = await fetch(endpointUrl).then(res => res.json())
    const serializedRecords = rawRecords.map(record => recordSerializer(record))

    // Option 1: Log the records to the console which can be piped to a .ndjson file
    serializedRecords.forEach(doc => console.log(JSON.stringify(doc, null, 0)))

    // Option 2: Use the sanity client to update records via the API rather than the CLI
    // You'll need to require the sanityClient from `utils/sanity-client`
    // const transaction = sanityClient.transaction()
    // serializedRecords.forEach(document => {
    //   transaction.createOrReplace(document)
    // })
    // transaction.commit()
  } catch (error) {
    console.error(error)
  }
})
