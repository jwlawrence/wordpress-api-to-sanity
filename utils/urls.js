require("dotenv").config();

function getEndpointUrl(segment) {
  return `${process.env.WP_API_ENDPOINT || ""}/${segment}?per_page=100`;
}

module.exports = {
  getEndpointUrl,
};
