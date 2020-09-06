const tape = require("tape");
const bent = require("bent");
const getPort = require("get-port");
const nock = require("nock");

const server = require("../index");
const response = require("./mockResponse.json");

const getJSON = bent("json");
const getBuffer = bent("buffer");

const scope = nock(`https://nodejs.org`)
  .get(`/dist/index.json`)
  .reply(200, response)
  .persist();

const context = {};

tape("setup", async function (t) {
  const port = await getPort();
  context.server = server.listen(port);
  context.origin = `http://localhost:${port}`;

  t.end();
});

tape("should get dependencies", async function (t) {
  const html = (await getBuffer(`${context.origin}/dependencies`)).toString();
  t.ok(html.includes("bent"), "should contain bent");
  t.ok(html.includes("express"), "should contain express");
  t.ok(
    html.includes("express-handlebars"),
    "should contain express-handlebars"
  );
  t.ok(html.includes("hbs"), "should contain hbs");
  t.end();
});

tape("should get minimum secure", async function (t) {
  const data = await getJSON(`${context.origin}/minimum-secure`);

  const v14secure = data.v14.version;
  const v13secure = data.v13.version;
  const v12secure = data.v12.version;
  const v6secure = data.v6.version;

  t.equal(v14secure, "v14.4.0", "v14 should match");
  t.equal(v13secure, "v13.8.0", "v13 should match");
  t.equal(v12secure, "v12.18.0", "v12 should match");
  t.equal(v6secure, "v6.17.0", "v6 should match");
  t.end();
});

tape("should get latest releases", async function (t) {
  const data = await getJSON(`${context.origin}/latest-releases`);

  const v8latest = data.v8.version;
  const v7latest = data.v7.version;
  const v4latest = data.v4.version;
  const v0latest = data.v0.version;

  t.equal(v8latest, "v8.17.0", "v8 should match");
  t.equal(v7latest, "v7.10.1", "v7 should match");
  t.equal(v4latest, "v4.9.1", "v4 should match");
  t.equal(v0latest, "v0.12.18", "v6 should match");
  t.end();
});

// more tests

tape("teardown", function (t) {
  context.server.close();
  t.end();
});
