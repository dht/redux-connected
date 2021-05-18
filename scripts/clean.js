const fs = require("fs-extra");
const globby = require("globby");

globby
  .sync("packages/*/node_modules", {
    onlyDirectories: true,
  })
  .forEach((path) => {
    fs.rmdirSync(path, { recursive: true });
  });

globby.sync("packages/*/yarn.lock", {}).forEach((path) => {
  fs.unlinkSync(path);
});

fs.rmdirSync("./node_modules", { recursive: true });

fs.unlink("yarn.lock");
