// src/routerParse.ts
import * as fs from "fs";
import * as Path from "path";
import "ts-replace-all";
import * as Beautify from "js-beautify";
var parsePagesDirectory = (ctx2) => {
  const rootDir = ctx2.dir;
  const generatefileConfig = (path, file) => {
    const name = file.split(".")[0];
    let importPath = `../${path}/${file}`;
    if (file.endsWith(".vue")) {
      const Compnent = `() => import('${importPath}')`;
      const startIndex = importPath.indexOf(rootDir) + rootDir.length;
      let Path2 = importPath.substring(startIndex, importPath.length - 4);
      Path2 = Path2.replace("/index", "").replace("_", ":");
      const Name = Path2.slice(1, Path2.length).replace("/", "-").replace(":", "");
      let routeConfig = {
        name: Name,
        path: Path2,
        component: Compnent
      };
      if (ctx2.hook.extend) {
        routeConfig = ctx2.hook.extend(routeConfig);
      }
      return routeConfig;
    } else {
      return {
        name,
        path: `/${name}`,
        children: fs.readdirSync(Path.join(__dirname, `../../src/${path}/${file}`)).map((f) => {
          return generatefileConfig(`${path}/${file}`, f);
        })
      };
    }
  };
  const dirPositon2Plugin = Path.join(__dirname, `../../src/${rootDir}`);
  const routes = fs.readdirSync(dirPositon2Plugin).map((f) => {
    return generatefileConfig(rootDir, f);
  });
  return { routes };
};
var updateRoutes = (ctx2) => {
  const { routes } = parsePagesDirectory(ctx2);
  let routerStr = `const routes = ${JSON.stringify(routes)}`;
  routerStr = routerStr.replace(/("(\\[^]|[^\\"])*"(?!\s*:))|"((\\[^]|[^\\"])*)"(?=\s*:)/g, "$1$3");
  routerStr = routerStr.replaceAll('"(', "(").replaceAll(')"', ")");
  const exportSrt = "export default routes";
  ctx2.routes = Beautify.js(`
    ${routerStr}


    ${exportSrt}
  `, {
    indent_size: 2,
    space_in_empty_paren: true
  });
  fs.writeFileSync(
    "./src/router/routes.ts",
    Beautify.js(`
      ${routerStr}


      ${exportSrt}
    `, {
      indent_size: 2,
      space_in_empty_paren: true
    }, "utf-8")
  );
};

// src/ctx.ts
var ctx = {
  dir: "./src/views",
  server: {},
  routes: {},
  hook: {
    extend: {}
  },
  setupViteServer: (watcher) => {
    watcher.on("unlink", async (path) => {
      console.log("\u6587\u4EF6unlink");
      updateRoutes(ctx);
    });
    watcher.on("add", async (path) => {
      console.log("\u6587\u4EF6add");
      updateRoutes(ctx);
    });
    watcher.on("change", async (path) => {
      console.log("\u6587\u4EF6change");
      updateRoutes(ctx);
    });
  }
};

// src/index.ts
var pluginRoutes = (userOptions = {}) => {
  return {
    name: "vite-plugin-generate-routes",
    enforce: "pre",
    apply: "serve",
    config(config, { command }) {
      if (command === "serve") {
      }
    },
    transform(src, id) {
    },
    configResolved(resolvedConfig) {
      console.log("\u8FD9\u91CC\u662FconfigResolved\u94A9\u5B50");
      ctx.dir = userOptions.dir || ctx.dir;
      if (userOptions.extend) {
        ctx.hook.extend = userOptions.extend;
      }
      updateRoutes(ctx);
    },
    configureServer(server) {
      console.log("\u8FD9\u91CC\u662FconfigureServer\u94A9\u5B50");
      ctx.setupViteServer(server.watcher);
    }
  };
};
var src_default = pluginRoutes;
export {
  src_default as default
};
