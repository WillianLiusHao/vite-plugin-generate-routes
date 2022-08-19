# vite-plugin-generate-routes

## use

```js
/** vite.config.js */
import pluginRoutes from 'vite-plugin-generate-routes'
export default defineConfig({
  plugins: [
    pluginRoutes()
  ]
  ...
}
```

## nuxt rules

```js
pages：
--| page1.vue
--| id.vue
--| page2
----| index.vue
----| page21.vue
----| _id_.vue
--| page3
----| page31.vue
----| #componentName.vue

=>

routes：
--| page1
--| page2
----| page2/page21
----| page2/:id
----| page31.vue
```

- start with '\_' means dynamic component：`page/_id.vue` => `/page/:id`
- start width '#' means ignore

## config

### dir

- Type: `string`
- Default: `./src/views`
