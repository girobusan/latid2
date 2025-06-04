import { md } from "./md_wrapper";
import yaml from "js-yaml";
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

export default function md2html(src) { }
