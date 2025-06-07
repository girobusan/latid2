const nunjucks = require("nunjucks");

// template fns
// attachList(...)

renderFile(file, page, pages, writeFn){
  let virtuals = [];
  let page = file.page || 0;
  let pages = file.pages || 1;
  function addVirtual(sf, props) {

    virtuals.push(sf)
  }
}
