const fetch = require("node-fetch");
const serializePost = require("../serializers/post");
const { getEndpointUrl } = require("../utils/urls");
const ENDPOINT_NAME = "posts";

async function getPosts() {
  const posts = await fetch(getEndpointUrl(ENDPOINT_NAME));
  const postsJson = await posts.json();

  return Promise.all(
    postsJson.map(async (postJson) => {
      const serializedPost = serializePost(postJson);
      const featuredMedia = postJson._links["wp:featuredmedia"];

      // Get details about the featured media
      if (featuredMedia) {
        const attachment = await fetch(featuredMedia[0].href);
        const attachmentJson = await attachment.json();
        serializedPost.featuredImage = {
          _type: "image",
          _sanityAsset: `image@${attachmentJson.source_url}`,
        };
      }

      return serializedPost;
    })
  );
}

module.exports = getPosts;
