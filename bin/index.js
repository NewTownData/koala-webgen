const http = require("http");
const path = require("path");
const fs = require("fs");
const Handlebars = require("handlebars");

Handlebars.registerHelper("include", function (source) {
  const includeContent = loadFile(
    path.join(theme, "components", `${source}.html`)
  );
  const template = Handlebars.compile(includeContent);
  return template(this);
});

function loadFile(path) {
  return fs.readFileSync(path, { encoding: "utf8" });
}

const cwd = process.cwd();

const configuration = path.resolve(cwd, "website", "configuration.json");
const config = JSON.parse(loadFile(configuration));

const pages = path.resolve(cwd, "website", "pages");
const posts = path.resolve(cwd, "website", "posts");
const static = path.resolve(cwd, "website", "static");
const theme = path.resolve(cwd, "website", "themes", config.theme);

const Port = 3080;
const server = http.createServer((request, response) => {
  let pathname = "/";

  try {
    const url = new URL(`http://localhost:${Port}${request.url}`);
    pathname = decodeURIComponent(url.pathname);
  } catch (e) {
    console.warn("Invalid URL", e);
  }

  if (pathname === "/favicon.ico") {
    pathname = "/images/favicon.ico";
  }

  if (pathname.indexOf("/") === 0) {
    pathname = pathname.substring(1);
  }

  const content = getContent(pathname);
  switch (content.type) {
    case "html":
      console.log(`HTML for /${pathname}`);
      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
      });
      response.end(renderPage(pathname, content));
      break;
    case "file":
      const mimeType = detectMimeType(pathname);
      console.log(`Content Type: ${mimeType}`);
      response.writeHead(200, {
        "Content-Type": mimeType,
        "Content-Length": content.content.length,
      });
      response.end(content.content);
      break;
    default:
      response.writeHead(404, "Not Found", {
        "Content-Type": "text/plain; charset=utf-8",
      });
      response.end("Not found");
      break;
  }
});

server.listen(Port, () => {
  console.log(`Running at http://localhost:${Port}`);
});

function loadMenu() {
  return Object.keys(config.menu).map((k) => ({
    url: config.menu[k],
    title: k,
  }));
}

function renderPage(pathname, content) {
  const menu = loadMenu();

  const indexContent = loadFile(path.join(theme, "index.html"));
  const template = Handlebars.compile(indexContent);

  return template({
    ...config,
    menu,
    path: `/${pathname}`,
    ...content,
  });
}

function detectMimeType(pathname) {
  if (/.*\.jpg/.test(pathname)) {
    return "image/jpeg";
  }
  if (/.*\.png/.test(pathname)) {
    return "image/png";
  }
  if (/.*\.ico/.test(pathname)) {
    return "image/x-icon";
  }
  if (/.*\.html/.test(pathname)) {
    return "text/html";
  }
  if (/.*\.css/.test(pathname)) {
    return "text/css";
  }
  if (/.*\.js/.test(pathname)) {
    return "text/javascript";
  }
}

function loadPosts() {
  const items = fs.readdirSync(posts, "utf-8");
  return items
    .filter((name) => /.*\.html/.test(name))
    .map((name) => loadPost(name, loadFile(path.join(posts, name)), true));
}

function loadPost(name, content, trim) {
  const date = /<!-- date: ([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2}) -->/.exec(
    content
  );
  const tags = /<!-- tags: (.*) -->/.exec(content);
  const title = /<!-- title: (.*) -->/.exec(content);

  let result = content;
  const idx = content.indexOf("<!-- more -->");
  if (trim && idx >= 0) {
    result = content.substring(0, idx);
  }

  return {
    title: title[1],
    url: `/${name}`,
    date: new Date(
      parseInt(date[1]),
      parseInt(date[2]) - 1,
      parseInt(date[3]),
      parseInt(date[4]),
      parseInt(date[5]),
      parseInt(date[6])
    ),
    tags: tags[1].split(","),
    content: result,
    preview: trim,
  };
}

function getContent(pathname) {
  if (pathname === "") {
    console.log("Root");
    // root
    return { type: "html", posts: loadPosts() };
  } else {
    // 1. check page
    const pageFile = path.join(pages, pathname);
    if (fs.existsSync(pageFile)) {
      console.log(`Page ${pageFile}`);
      return { type: "html", page: loadFile(pageFile) };
    }

    // 2. check post
    const postFile = path.join(posts, pathname);
    if (fs.existsSync(postFile)) {
      console.log(`Post ${postFile}`);
      return {
        type: "html",
        posts: [loadPost(pathname, loadFile(postFile), false)],
      };
    }

    // 3. check static
    const staticFile = path.join(static, pathname);
    if (fs.existsSync(staticFile)) {
      console.log(`Static ${staticFile}`);

      return { type: "file", content: fs.readFileSync(staticFile) };
    }

    // 3. check static
    const themeFile = path.join(theme, pathname);
    if (fs.existsSync(themeFile)) {
      console.log(`Theme ${themeFile}`);
      return { type: "file", content: fs.readFileSync(themeFile) };
    }

    console.warn(`No file found for ${pathname}`);
    return { type: "404" };
  }
}
