import { Feed } from "feed";
import { md } from "./md_wrapper";

export function makeFeed(lst, config) {
  let cleanURL = config.url.replace(/\/$/, "");

  let TheFeed = new Feed({
    title: config.title || "My feed",
    description: config.description || config.motto || "Nondescript site",
    id: cleanURL,
    link: cleanURL,
    image: config.rss_image || "",
    author: config.author || "",
  });

  let posts = lst.slice(0, config.rss_length);
  posts.forEach((p) => {
    // :TODO: — remove ↓
    let finalUrl = cleanURL + p.file.path.replace(/\.[^.]+$/, ".html");
    let txt = md.renderInline(p.meta.excerpt || "");
    TheFeed.addItem({
      title: p.meta.title,
      id: config.url + p.file.path,
      link: finalUrl,
      description: txt,
      image: config.url + p.meta.image,
      date: p.meta.date,
    });
  });

  return TheFeed.rss2();
}
