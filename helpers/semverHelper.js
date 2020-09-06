const semver = require("semver");

function isHigherVersion(toCheck, current) {
  return semver.gt(
    semver.coerce(toCheck).version,
    semver.coerce(current).version
  );
}

module.exports = {
  isHigherVersion,
};
