const fs = require("fs"), vm = require("vm");
const app = fs.readFileSync(process.argv[2], "utf8");
try { new vm.Script(app, { filename: "app.js" }); console.log("app.js compiles", app.length, "chars"); }
catch (e) { console.log("FAIL app.js", e.message, (e.stack || "").split("\n").slice(0, 3).join(" | ")); process.exit(1); }
