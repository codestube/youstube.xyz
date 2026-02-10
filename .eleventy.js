module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("styles");
  eleventyConfig.addPassthroughCopy("scripts");
  
  return {
    dir: {
      input: "src",
      output: "public",
      includes: "_includes"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
