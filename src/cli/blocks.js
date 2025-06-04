const fence = "```";

const helpers = {
  attachment: (url, title, className) => {
    return `
<!--@attachment-->
[${title || url}](${url})

<!--title:${title}-->
<!--url:${url}-->
<!--class:${className}-->
<!--//-->
 
`;
  },
};

export function convertBlocks(blocks) {
  let txt = "";
  blocks.forEach((blk) => {
    let t = blk.type;
    let b = blk.data;
    switch (t) {
      //simple ones
      case "paragraph":
        txt += b.text + "\n\n";
        break;
      case "markdown":
        txt += b.markdown + "\n\n";
        break;
      case "code":
        txt += "```\n" + b.code + "\n```\n\n";
        break;
      case "header":
        txt += "#######".substring(0, +b.level) + " " + b.text + "\n\n";
        break;
      case "list":
        let lt = b.style === "ordered" ? "1. " : "* ";
        txt += b.items.map((i) => `${lt}${i}`).join("\n");
        txt += "\n";
        break;
      // complicated
      case "attachment":
        if (!b.hidden) {
          txt += helpers.attachment(b.url, b.title || b.filename, b.class);
        }
        break;

      default:
        console.log("Unknown block:", b.type);
    }
  });
}
