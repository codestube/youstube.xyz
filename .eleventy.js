module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("styles");
  eleventyConfig.addPassthroughCopy("scripts");
  eleventyConfig.addPassthroughCopy({"node_modules/jquery/dist/jquery.min.js": "scripts/jquery.min.js"});
  eleventyConfig.addPassthroughCopy({"node_modules/jquery.terminal/js/jquery.terminal.min.js": "scripts/jquery.terminal.min.js"});
  eleventyConfig.addPassthroughCopy({"node_modules/jquery.terminal/css/jquery.terminal.min.css": "styles/jquery.terminal.min.css"});
  
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
