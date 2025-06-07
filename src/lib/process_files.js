const yaml = require("js-yaml");
import { extractFM } from "./fm_extractor";
import { makeFeed } from "./rss";

const mdfileRx = /\.(md|markdown)$/i;
const paragraphRx = /^([^-[{<#\n])(.+?)\n\n/gm;
const imageRx = /!\[.*?\]\s*\((.*?)\)/m;

/**
 * @param { Object[] } lst - list of file info objects
 * @param {function} writeFn — function, which writes content by site path
 * @param { object} config - site configuration
 */

function preparseMdFile(f) {
  let content = f.getContent();
  f.getContent = () => content;
  // console.log(content);
  let parts = extractFM(content);
  if (!parts.meta) {
    return { file: f, meta: null, content: content };
  }
  const metadata = yaml.load(parts.meta);
  if (!metadata.title) {
    return { file: f, meta: null, content: content };
  }
  return { file: f, meta: metadata, content: parts.markdown };
}

function sortAndRun(lst, writeFn, config) {
  // fix date
  lst.forEach((f) => {
    if (f.meta.date) {
      let dateParts = f.meta.date.split(/\D+/).map((e) => +e);
      f.meta.date = new Date(
        dateParts[0],
        dateParts[1] - 1,
        dateParts[2],
        dateParts[3] || 0,
        dateParts[4] || 0,
      );
    } else {
      f.meta.date = new Date(1980, 0, 1);
    }
  });
  // sort by date
  lst.sort((a, b) => {
    const atime = a.meta.date.getTime();
    const btime = b.meta.date.getTime();
    return Math.sign(btime - atime);
  });
  // search for excerpts
  lst.forEach((f) => {
    if (f.meta.excerpt || !f.content) {
      return;
    }
    // console.log(f);
    let firstP = f.content.match(paragraphRx);
    if (!firstP) {
      return;
    }
    f.meta.excerpt = firstP[0].trim();
  });
  // find images
  lst.forEach((f) => {
    if (f.meta.image) {
      return;
    }
    let img = imageRx.exec(f.content);
    if (!img) {
      return;
    }
    f.meta.image = img[1];
  });
  //must be ok to build rss
  console.info("Writting RSS...");
  writeFn(config.rss_uri, makeFeed(lst, config));
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
    // path on site will be html
    preparsed.file.path = preparsed.file.path.replace(/\.[^.]+$/, ".html");
    processList.push(preparsed);
  });
  console.info("Source files to process:", processList.length);
  sortAndRun(processList, writeFn, config);
  return copyList;
}
