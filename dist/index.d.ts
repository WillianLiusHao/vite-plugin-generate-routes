import { PluginOption } from 'vite';

/**
 * vite-plugin-autoRouter
 * 遵循nuxt 规则，自动生成路由
 */

declare type UserOpts = {
    dir?: string;
    extend?: Function;
};
declare const pluginRoutes: (userOptions?: UserOpts) => PluginOption;

export { pluginRoutes as default };
