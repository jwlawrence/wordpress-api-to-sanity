const fetch = require("node-fetch");
const serializeAuthor = require("../serializers/author");
const { getEndpointUrl } = require("../utils/urls");
const ENDPOINT_NAME = "users";

async function getAuthors() {
  const authors = await fetch(getEndpointUrl(ENDPOINT_NAME));
  const authorsJson = await authors.json();

  return authorsJson.map((authorJson) => {
    return serializeAuthor(authorJson);
  });
}

module.exports = getAuthors;
