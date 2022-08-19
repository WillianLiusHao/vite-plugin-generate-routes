import * as fs from 'fs'
import * as Path from 'path'
import 'ts-replace-all'

import * as Beautify from 'js-beautify'

/**
 * 
 * @param rootDir 路由根目录
 * @returns { import, routes } import配置和routes配置
 */
const parsePagesDirectory = (ctx) => {
  const rootDir = ctx.dir
  const generatefileConfig = (path: string, file: string) => {
    const name = file.split('.')[0] // 文件名
    let importPath = `../${path}/${file}`

    //  *如果是组件
    if (file.endsWith('.vue')) {
      // 1.组件变量名 Compnent
      const Compnent = `() => import('${importPath}')`
      
      // 2.组件路径 Path
      const startIndex = importPath.indexOf(rootDir) + rootDir.length
      /*
        ../views/page2/page22.vue => /page2/page22
      */
      let Path = importPath.substring(startIndex, importPath.length - 4)

      Path = Path.replace('/index', '').replace('_', ':')

      // 3.组件名称 name
      /**
        /page2/:id => page-id
      */
      const Name = Path.slice(1, Path.length).replace('/', '-').replace(':', '')
      

      let routeConfig: any = {
        name: Name,
        path: Path,
        component: Compnent
      }
      if(ctx.hook.extend) {
        routeConfig = ctx.hook.extend(routeConfig)
      }
      return routeConfig
    } else {
    // 如果是文件夹
      return {
        name: name,
        path: `/${name}`,
        children: fs.readdirSync(Path.join(__dirname, `../../../src/${path}/${file}`)).map((f: string) => {
          return generatefileConfig(`${path}/${file}`, f)
        })
        
      }
    }
  }
  // 如何处理项目根路径和插件路径问题？
  const dirPositon2Plugin = Path.join(__dirname, `../../../src/${rootDir}`) // 路由页面相对于插件的位置
  const routes = fs.readdirSync(dirPositon2Plugin).map((f) => {
    return generatefileConfig(rootDir, f)
  })
  return { routes }
}

const updateRoutes = (ctx) => {
  const { routes } = parsePagesDirectory(ctx)

  let routerStr = `const routes = ${JSON.stringify(routes)}`
  // 去掉 json 的key值引号, 去掉component val 的引号
  routerStr = routerStr.replace(/("(\\[^]|[^\\"])*"(?!\s*:))|"((\\[^]|[^\\"])*)"(?=\s*:)/g, '$1$3')
  routerStr = routerStr.replaceAll('"(', '(').replaceAll(')"', ')')
  const exportSrt = 'export default routes'

  // 保存生成的 路由配置(可供用户从插件中导入使用)
  ctx.routes = Beautify.js(`
    ${routerStr}\n\n
    ${exportSrt}
  `, {
    indent_size: 2,
    space_in_empty_paren: true
  })
  // 生成配置文件(无需用户导入，在用户的路由文件下给他生成配置)
  fs.writeFileSync('./src/router/routes.ts', 
    Beautify.js(`
      ${routerStr}\n\n
      ${exportSrt}
    `, {
      indent_size: 2,
      space_in_empty_paren: true
    }, 'utf-8')
  )
}

export {
  parsePagesDirectory,
  updateRoutes
}
