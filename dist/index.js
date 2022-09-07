"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/routerParse.ts
var fs = __toESM(require("fs"));
var import_ts_replace_all = require("ts-replace-all");
var Beautify = __toESM(require("js-beautify"));
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
