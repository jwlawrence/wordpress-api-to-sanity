const fetch = require("node-fetch");
const fs = require("fs");
const endpointFileNames = fs.readdirSync("./api/");

/**
 * Fetch and serialize data for each file in the serializers folder
 */
for (let i = 0; i < endpointFileNames.length; i++) {
  const endpointFileName = endpointFileNames[i];
  if (endpointFileName.startsWith("_")) {
    continue;
  }
  getEndpointData(endpointFileName);
}

async function getEndpointData(endpointFileName) {
  // Get the serializer for the record type
  const recordFetcher = require(`./api/${endpointFileName}`);

  // Fetch the data from WP, serialize it, log it to the console
  try {
    const endpointRecords = await recordFetcher();

    // Option 1: Log the records to the console which can be piped to a .ndjson file
    endpointRecords.forEach((doc) => console.log(JSON.stringify(doc, null, 0)));

    // Option 2: Use the sanity client to update records via the API rather than the CLI
    // You'll need to require the sanityClient from `utils/sanity-client`
    // const transaction = sanityClient.transaction()
    // serializedRecords.forEach(document => {
    //   transaction.createOrReplace(document)
    // })
    // transaction.commit()
  } catch (error) {
    console.error(error);
  }
}
