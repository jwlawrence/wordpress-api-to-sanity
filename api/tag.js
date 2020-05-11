const fetch = require("node-fetch");
const serializeTag = require("../serializers/tag");
const { getEndpointUrl } = require("../utils/urls");
const ENDPOINT_NAME = "tags";

async function getTags() {
  const tags = await fetch(getEndpointUrl(ENDPOINT_NAME));
  const tagsJson = await tags.json();

  return tagsJson.map((tagJson) => {
    return serializeTag(tagJson);
  });
}

module.exports = getTags;
