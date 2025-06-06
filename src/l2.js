//CLI generator
const { parseArgs } = require("node:util");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
import { preprocessFileList } from "./lib/process_files";

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
      getContent: () => fs.readFileSync(path.join(f.parentPath, f.name)),
      filename: f.name,
      path: path.join(f.parentPath, f.name).substring(filesInputDir.length),
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
console.info("Copy assets:", toCopy.length, "files");
toCopy.forEach((f) => fs.copyFile(f.src, path.join(outputDir, f.path)));
//COPY THEME FILES
