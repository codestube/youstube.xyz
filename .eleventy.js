let assetVersion = Date.now();

module.exports = function(eleventyConfig) {
  eleventyConfig.setServerOptions({
    headers: {
      "Cache-Control": "no-store"
    }
  });
  eleventyConfig.addGlobalData("assetVersion", function() {
    return assetVersion;
  });

  // Copy static assets
  eleventyConfig.addPassthroughCopy({"assets": "."});
  eleventyConfig.addPassthroughCopy("styles");
  eleventyConfig.addPassthroughCopy("scripts");
  eleventyConfig.addPassthroughCopy({"node_modules/jquery/dist/jquery.min.js": "scripts/jquery.min.js"});
  eleventyConfig.addPassthroughCopy({"node_modules/jquery.terminal/js/jquery.terminal.min.js": "scripts/jquery.terminal.min.js"});
  eleventyConfig.addPassthroughCopy({"node_modules/jquery.terminal/css/jquery.terminal.min.css": "styles/jquery.terminal.min.css"});

  eleventyConfig.addFilter("readableDate", function(dateValue) {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    }).format(new Date(dateValue));
  });

  eleventyConfig.addFilter("htmlDateString", function(dateValue) {
    return new Date(dateValue).toISOString().slice(0, 10);
  });

  eleventyConfig.addCollection("archivePosts", function(collectionApi) {
    return collectionApi.getFilteredByTag("archivePost").sort(function(left, right) {
      const dateDifference = right.date.getTime() - left.date.getTime();
      if (dateDifference !== 0) {
        return dateDifference;
      }

      const eventDifference = String(left.data.event || "").localeCompare(String(right.data.event || ""));
      if (eventDifference !== 0) {
        return eventDifference;
      }

      return String(left.data.title || "").localeCompare(String(right.data.title || ""));
    });
  });

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
