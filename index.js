const express = require("express");
const exphbs = require("express-handlebars");
const bent = require("bent");
const getJSON = bent("json");

const { versionReducer } = require("./helpers/versionReducer");
const { dependencies } = require("./package.json");

const PORT = 3000;
const apiUrl = "https://nodejs.org/dist/index.json";

const app = express();

app.engine(
  "hbs",
  exphbs({
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

app.get("/dependencies", function (req, res) {
  const deps = Object.entries(dependencies).map(
    ([depName, version]) => `${depName} - ${version}`
  );
  res.render("dependencies", {
    deps,
  });
});

app.get("/minimum-secure", async (req, res) => {
  const data = await getJSON(apiUrl);
  const securedData = data
    .filter((dep) => dep.security)
    .reduce(versionReducer, {});
  res.send(securedData);
});

app.get("/latest-releases", async (req, res) => {
  const data = await getJSON(apiUrl);
  const latestReleases = data.reduce(versionReducer, {});
  res.send(latestReleases);
});

app.listen(PORT);
console.log(`Listening on port ${PORT}`);

module.exports = app;
