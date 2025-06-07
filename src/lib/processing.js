import { extractFM } from "./fm_extractor";
const yaml = require("js-yaml");
//all processing routines
//we have more than one subsets of processed files:
//
// - Content files (shows in RSS) (PAGES)
// - Virtual ones — pages of multipage lists, tags, rss feed (VIRTUALS)
//   thay may be added in processing time
//
// and we have files,
// which are not processed
// but present
//
// - Ones we just copy (ASSETS)
//   they do not have meta?
//
// for each file we will add `data` field

// PREPARATIONS
// - clean up metadata ( )
// - gather tags
// - compile rss
// - ...

export function process(plist, config, writeFn) {
  //plist is list of preparsed files
}
