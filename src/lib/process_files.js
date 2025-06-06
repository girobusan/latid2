import { extractFM } from "./fm_extractor";

const mdfileRx = /\.(md|markdown)$/i;

/**
 * @param { Object[] } lst - list of file info objects
 * @param {function} writeFn — function, which writes content by site path
 * @param { object} config - site configuration
 */

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
    let content = f.getContent();
    let parts = extractFM(content);
    if (!parts.meta || !parts.meta.title) {
      copyList.push(f);
      return;
    }
    processList.push(f);
  });
  console.info("Source files to process:", processList.length);
  return copyList;
}
