const themeColour = "#63b3ed";
const routerBase = {};
const maskableIconSrc = "/maskable_icon.png";

export default {
  ssr: false,
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: "static",
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: "Judge of Character",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
      { name: "msapplication-TileColor", content: themeColour },
    ],
    link: [
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "mask-icon",
        href: "/safari-pinned-tab.svg",
        color: themeColour,
      },
    ],
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: ["@/plugins/composition-api"],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    "@nuxt/typescript-build",
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    "@nuxtjs/tailwindcss",
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/pwa"],
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
  ...routerBase,
  pwa: {
    meta: {
      theme_color: themeColour,
    },
    manifest: {
      name: "Judge Of Character",
      short_name: "Judge",
      start_url: "../",
      display: "standalone",
      background_color: themeColour,
      icons: [
        {
          src: maskableIconSrc,
          sizes: "731x731",
          type: "/image/png",
          purpose: "any maskable",
        },
      ],
    },
  },
  server: {
    host: "0.0.0.0",
  },
  telemetry: false,
};
