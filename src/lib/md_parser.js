import { md } from "./md_wrapper";
import { extractFM } from "./fm_extractor";
const yaml = require("yaml");

//
//extract helpers
//for each:
//generate default html
//generate RIGHT html
//
//parse all md
//replace def.htmls with right ones
//
//
const helperRx = /<!--\s*(h:|!|@)[a-zA-Z_0-9-]+-->(.+?)<!--\s*\/\/\s*-->/gms;
const fencedRx = /`{3,5}\n(.*?)`{3,5}\n/gms;
const paramCommentRx = /<!--\s*([^@][a-zA-Z_0-9-]+)\s*:\s*(.*?)\s*-->/gms;

export default function md2html(md_src) {
  //extract all helpers
  let hlprs = [];
  //replace them in md with marker <!--#{number}-->
  md_src.replace(helperRx, (m) => {
    hlprs.push(m);
    return `<!--#${hlprs.length - 1}#-->`;
  });
  let html = md.render(md_src);
  //md=>html
  //replace markers with helpers result
  return html;
}
