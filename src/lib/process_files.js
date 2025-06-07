const yaml = require("js-yaml");
import { extractFM } from "./fm_extractor";

const mdfileRx = /\.(md|markdown)$/i;

/**
 * @param { Object[] } lst - list of file info objects
 * @param {function} writeFn — function, which writes content by site path
 * @param { object} config - site configuration
 */

function preparseMdFile(f) {
  let content = f.getContent();
  f.getContent = () => content;
  let parts = extractFM(content);
  if (!parts.meta) {
    return { file: f, meta: null, content: content };
  }
  const metadata = yaml.load(parts.meta);
  if (!metadata.title) {
    return { file: f, meta: null, content: content };
  }
  return { file: f, meta: metadata, content: parts.content };
}

export function preprocessFileList(lst, writeFn, config) {
  let copyList = [];
  let processList = [];

  // GENERATE LIST OF OUTPUT FILES, INCLUDING
  //  - tags pages
  //  - multipage lists
  //  - other generated stuff?
  lst.forEach((f) => {
    if (!f.filename.match(mdfileRx)) {
      copyList.push(f);
      return;
    }
    //we need to read
    const preparsed = preparseMdFile(f);
    if (!preparsed.meta) {
      copyList.push(f);
      return;
    }
    processList.push(preparsed);
  });
  console.info("Source files to process:", processList.length);

  return copyList;
}
