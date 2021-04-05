const { fork } = require("child_process");

let server;
const watch = process.argv.includes("--watch");

require("esbuild")
  .build({
    entryPoints: ["index.ts"],
    outfile: "index.js",
    bundle: true,
    platform: "node",
    target: "node14.16.0",
    external: ["express"],
    watch: {
      onRebuild(error, result) {
        if (error) {
          console.error("watch build failed:", error);
        } else {
          server.kill();
          server = fork("./index.js");
        }
      },
    },
  })
  .then((result) => {
    if (watch) {
      server = fork("./index.js");
    } else {
      result.stop();
    }
  });
