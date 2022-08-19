
/**
 * vite-plugin-autoRouter
 * 遵循nuxt 规则，自动生成路由
 */

import type { PluginOption } from "vite"

import { ctx } from './ctx'
import { updateRoutes } from './routerParse'

type UserOpts = {
  dir?: string,
  extend?: Function
}

const pluginRoutes = (userOptions: UserOpts = {}): PluginOption => {
  // 定义vite插件唯一id
  return {
    name: 'vite-plugin-generate-routes',
    enforce: 'pre',
    apply: 'serve', 
    config(config, { command }) {
      if (command === 'serve') { }
    },
    transform(src, id) {},
    configResolved(resolvedConfig) {
      // 在解析 vite 配置后调用。使用这个钩子读取和存储最终解析的配置。当插件需要根据运行的命令做一些不同的事情时，它很有用。
      console.log('这里是configResolved钩子');
      ctx.dir = userOptions.dir || ctx.dir
      // 钩子拓展
      if(userOptions.extend) {
        ctx.hook.extend = userOptions.extend
      }
      updateRoutes(ctx)
    },
    configureServer(server) {
      // 主要用来配置开发服务器，为 dev-server (connect 应用程序) 添加自定义的中间件
      console.log('这里是configureServer钩子');
      ctx.setupViteServer(server.watcher)
    },
  }
}

export default pluginRoutes
