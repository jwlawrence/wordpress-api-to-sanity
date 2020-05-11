const parseBody = require("../utils/parse-body");
const sanitizeHtml = require("../utils/sanitize-html");

module.exports = function serializeAuthor(author) {
  return {
    _id: `author-${author.id}`,
    _type: "author",
    title: author.name || "",
    slug: {
      _type: "slug",
      current: author.slug,
    },
    photo: {
      _type: "image",
      _sanityAsset: `image@${author.avatar_urls["96"]}`,
    },
    description: sanitizeHtml(author.description),
  };
};
