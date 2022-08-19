# vite-plugin-generate-routes

## use

```js
/** vite.config.js */
import pluginRoutes from 'vite-plugin-generate-routes'
export default defineConfig({
  plugins: [
    vue(),
    pluginRoutes()
  ]
  ...
}
```

## nuxt rules

```js
pages/
--| people/
-----| _id.vue
-----| index.vue
--| _.vue
--| index.vue
```

=>

```js
/ -> index.vue
/people -> people/index.vue
/people/123 -> people/_id.vue
/about -> _.vue
/about/careers -> _.vue
/about/careers/chicago -> _.vue
```

- start with '\_' means dynamic component：`page/_id.vue` => `/page/:id`
- start width '#' means ignore

## config

### dir

- Type: `string`
- Default: `./src/views`
