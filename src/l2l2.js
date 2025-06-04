const { parseArgs } = require("node:util");
/*
 
-i — input dir
-o — output dir

*/

const options = {
  input: { type: "string", short: "i" },
  output: { type: "string", short: "o" },
};

const V = parseArgs({ options });
const inDir = V.values.input;
const outDir = V.values.output;

if (!inDir || !outDir) {
  console.log("Specify directory!");
  process.exit(1);
}
