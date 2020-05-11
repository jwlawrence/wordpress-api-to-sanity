const fetch = require("node-fetch");
const serializeCategory = require("../serializers/category");
const { getEndpointUrl } = require("../utils/urls");
const ENDPOINT_NAME = "categories";

async function getCategories() {
  const categories = await fetch(getEndpointUrl(ENDPOINT_NAME));
  const categoriesJson = await categories.json();

  return categoriesJson.map((categoryJson) => {
    return serializeCategory(categoryJson);
  });
}

module.exports = getCategories;
