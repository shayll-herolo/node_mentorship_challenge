const { isHigherVersion } = require("./semverHelper");

function versionReducer(acc, cur) {
  const key = cur.version.split(".")[0];

  // assign current version if doesn't exist or higher then already saved
  if (!acc[key] || isHigherVersion(cur.version, acc[key].version)) {
    return {
      ...acc,
      [key]: cur,
    };
  }
  
  return acc;
}

module.exports = {
  versionReducer,
};
