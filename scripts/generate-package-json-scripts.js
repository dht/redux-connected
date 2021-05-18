const fs = require("fs-extra");
const globby = require("globby");

const runAndWatchScripts = globby
  .sync("packages/*/package.json", {})
  .map((file) => {
    const content = fs.readJsonSync(file);
    const { scripts } = content;

    return {
      file,
      name: content.name,
      startExists: typeof scripts["start"] === "string",
      watchExists: typeof scripts["watch"] === "string",
    };
  })
  .reduce(
    (output, p) => {
      const { name, startExists, watchExists } = p;

      if (startExists) {
        output.run[`run:${name}`] = `yarn workspace ${name} start`;
      }

      if (watchExists) {
        output.watch[`watch:${name}`] = `yarn workspace ${name} watch`;
      }

      return output;
    },
    {
      run: {},
      watch: {},
    }
  );

const _package = fs.readJsonSync("./package.json");
const { scripts = {} } = _package;

_package.scripts = {
  ...filterRunAndWatch(scripts),
  ...runAndWatchScripts.run,
  ...runAndWatchScripts.watch,
};

fs.writeJsonSync("./package.json", _package, { spaces: 4 });

function filterRunAndWatch(scripts) {
  return Object.keys(scripts)
    .filter((key) => {
      return !key.match(/^run:/) && !key.match(/^watch:/);
    })
    .reduce((output, key) => {
      output[key] = scripts[key];
      return output;
    }, {});
}
