const _ = require("lodash");
const path = require("path");
const generateAdjacent = require("./utils/generate-adjacent");
const clean = require("./utils/clean");

module.exports = () => ({
  template: {
    title: "SurviveJS",
    file: path.resolve(__dirname, "templates/page.ejs")
  },
  output: "build",
  layout: () => require("./layouts/SiteBody").default,
  paths: {
    "/": {
      content: () => require.context("./pages", true, /^\.\/.*\.md$/),
      index: () => require("./layouts/SiteIndex").default
    },
    react: {
      content: () =>
        require.context("./books/react-book/manuscript", true, /^\.\/.*\.md$/),
      index: () => require("./layouts/BookIndex").default,
      layout: () => require("./layouts/BookPage").default,
      transform: pages =>
        generateAdjacent(
          require("./books/react-book/manuscript/Book.txt")
            .split("\n")
            .filter(name => path.extname(name) === ".md")
            .map(fileName => {
              const result = _.find(pages, { fileName });

              if (!result) {
                return console.error("Failed to find", fileName);
              }

              return result;
            })
        ),
      url: ({ sectionName, fileName }) =>
        `/${sectionName}/${clean.chapterName(fileName)}/`
    }
  }
});
