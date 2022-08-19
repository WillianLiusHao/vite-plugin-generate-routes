import type { FSWatcher } from 'fs'
import { updateRoutes } from './routerParse'

export const ctx = {
  dir: './src/views',
  server: {},
  routes: {},
  hook: {
    extend: {}
  },
  setupViteServer: (watcher: FSWatcher) => {
    watcher
      .on('unlink', async(path) => {
        console.log('文件unlink');
        updateRoutes(ctx)
      })
    watcher
      .on('add', async(path) => {
        console.log('文件add');
        updateRoutes(ctx)
      })
    watcher
      .on('change', async(path) => {
        console.log('文件change');
        updateRoutes(ctx)
      })
  }
}
