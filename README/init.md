# Initializing the Astro Project

I had to create a new project in another folder, since the installer didn't allow me to initialize the project in the one containing the old Go stuff (wasn't empty):

```sh
npm create astro@latest
```

> [!NOTE]
> Or even easier:
>
> ```sh
> npm create astro@latest -- --template minimal
> ```

The resulting project structure is quite simple:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Then I copied all the files to the `just-go` folder.

## TailwindCss

To add TailwindCss I followed the [Astro integration guide](https://tailwindcss.com/docs/installation/framework-guides/astro):

1. Install TailwindCss and the Vite plugin:

```sh
npm install tailwindcss @tailwindcss/vite
```

2. Add it to the `astro.config.mjs` file:

```js
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite"; // ✅ Here

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()], // ✅ Here
  },
});
```

3. Create a `./src/styles/global.css` file and add an @import for Tailwind CSS:

```css
@import "tailwindcss";
```

4. In the `src/layouts/Layout.astro`, we just have to import the stylesheet:

```astro
---
import '../styles/global.css'
---
```

## Aliases

I added the following to the `tsconfig.json`, to enjoy [import aliases](https://docs.astro.build/en/guides/typescript/#import-aliases):

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@styles/*": ["src/styles/*"],
      "@layouts/*": ["src/layouts/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@assets/*": ["src/assets/*"]
    }
  }
}
```
