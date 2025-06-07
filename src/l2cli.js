//CLI generator
const { parseArgs } = require("node:util");
const fs = require("fs");
const path = require("path");
const posixpath = require("path/posix");
const yaml = require("js-yaml");
import { preprocessFileList } from "./lib/process_files";

function fixPath(p) {
  // let r = posixpath.join(path.split(p));
  // if (!r.startsWith("/")) {
  //   r = "/" + r;
  // }
  let r = p.replace(/\\/g, "/");
  if (!r.startsWith("/")) {
    r = "/" + p;
  }
  return r;
}

const options = {
  input: { type: "string", short: "i" },
  output: { type: "string", short: "o" },
  timed: { type: "boolean", short: "t" },
};

const params = parseArgs({ options });
const inputDir = path.normalize(params.input || "./site");
const outputDir = path.normalize(params.output || "./static");
const today = new Date();

//read config
const CONFIG = yaml.load(
  fs.readFileSync(path.join(inputDir, "config/site.yaml")),
);

// list input files
// as fs.Dirent objects
const filesInputDir = path.join(inputDir, "src");
let inputFiles = fs
  .readdirSync(filesInputDir, {
    recursive: true,
    withFileTypes: true,
  })
  .filter((f) => f.isFile())
  .map((f) => {
    return {
      src: path.join(f.parentPath, f.name),
      getContent: () =>
        fs.readFileSync(path.join(f.parentPath, f.name), { encoding: "utf8" }),
      filename: f.name,
      path: fixPath(
        path.join(f.parentPath, f.name).substring(filesInputDir.length),
      ),
    };
  });

// GENERATE LIST OF FILES TO JUST COPY
// - if not markdown
// -if markdown, but without metadata
const toCopy = preprocessFileList(
  inputFiles,
  (p, c) => fs.writeFileSync(path.join(outputDir, p), c),
  CONFIG,
);
// why not async
console.info("Copying", toCopy.length, "assets...");
toCopy.forEach((f) =>
  fs.cp(
    f.src,
    path.join(outputDir, f.path),
    { recursive: true, force: true },
    (e) => e && console.log(e),
  ),
);
//COPY THEME FILES
if (CONFIG.theme) {
  const themeFilesPath = path.join(
    inputDir,
    "config/themes/assets",
    CONFIG.theme,
  );
  if (fs.existsSync(themeFilesPath)) {
    const themeOuptputPath = path.join(outputDir, "_themes", CONFIG.theme);
    fs.cp(
      themeFilesPath,
      themeOuptputPath,
      { recursive: true, force: true },
      (err) => err && console.error("Can not copy theme files", err),
    );
  } else {
    console.info("Theme does not include assets to copy.");
  }
}
