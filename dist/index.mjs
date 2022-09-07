// src/routerParse.ts
import * as fs from "fs";
import "ts-replace-all";
import * as Beautify from "js-beautify";
var parsePagesDirectory = (ctx2) => {
  const rootDir = ctx2.dir;
  const generatefileConfig = (path, file) => {
    var _a;
    const name = file.split(".")[0];
    let importPath = `../../${path}/${file}`;
    if (file.endsWith(".vue")) {
      const Compnent = `() => import('${importPath}')`;
      const startIndex = importPath.indexOf(rootDir) + rootDir.length;
      let Path = importPath.substring(startIndex, importPath.length - 4);
      Path = Path.replace("/index", "").replace("_", ":");
      const Name = Path.slice(1, Path.length).replace("/", "-").replace(":", "");
      let routeConfig = {
        name: Name,
        path: Path,
        component: Compnent
      };
      if (((_a = ctx2.hook) == null ? void 0 : _a.extend) instanceof Function) {
        routeConfig = ctx2.hook.extend(routeConfig);
      }
      return routeConfig;
    } else {
      return {
        name,
        path: `/${name}`,
        children: fs.readdirSync(`${path}/${file}`).map((f) => {
          return generatefileConfig(`${path}/${file}`, f);
        })
      };
    }
  };
  const routes = fs.readdirSync(rootDir).map((f) => {
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
    "src/router/routes.ts",
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
  dir: "src/views",
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
      ctx.dir = userOptions.dir || ctx.dir;
      if (userOptions.extend) {
        ctx.hook.extend = userOptions.extend;
      }
      updateRoutes(ctx);
    },
    configureServer(server) {
      ctx.setupViteServer(server.watcher);
    }
  };
};
var src_default = pluginRoutes;
export {
  src_default as default
};
