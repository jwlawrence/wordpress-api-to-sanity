const parseBody = require("../utils/parse-body");

module.exports = function serializePost(post) {
  return {
    _id: `post-${post.id}`,
    _type: post.type,
    title: post.title.rendered || "",
    slug: {
      _type: "slug",
      current: post.slug,
    },
    created: post.date,
    content: post.content.rendered
      ? parseBody(post.content.rendered)
      : [{ _type: "block", markDefs: [], children: [] }],
    excerpt: post.excerpt.rendered
      ? parseBody(post.excerpt.rendered)
      : [{ _type: "block", markDefs: [], children: [] }],
    authors: [{ _type: "reference", _ref: `author-${post.author}` }],
    categories: post.categories.map((categoryId) => ({
      _type: "reference",
      _ref: `category-${categoryId}`,
    })),
    tags: post.tags.map((tagId) => ({
      _type: "reference",
      _ref: `tag-${tagId}`,
    })),
  };
};
