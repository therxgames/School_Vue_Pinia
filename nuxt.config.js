import svgLoader from "vite-svg-loader";

const script = [];
const noscript = [];

if (process.env.NODE_ENV !== "development") {
  script.push({
    children: `
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(93315215, "init", {
          clickmap:true,
          trackLinks:true,
          accurateTrackBounce:true,
          webvisor:true
      });
    `,
  });

  noscript.push({
    children: `<div><img src="https://mc.yandex.ru/watch/93315215" style="position:absolute; left:-9999px;" alt="" /></div>`,
  });
}

export default defineNuxtConfig({
  ssr: true,

  buildDir: ".nuxt-build",

  app: {
    rootId: "my-school-app",

    head: {
      htmlAttrs: {
        lang: "ru",
      },
      meta: [
        {charset: "utf-8"},
        {name: "viewport", content: "width=device-width, initial-scale=1"},
        {name: "theme-color", content: "#ffffff"},
        {
          name: "description",
          content:
            "Федеральная государственная информационная система «Моя школа»",
        },
        {name: "keywords", content: ""},
        {name: "format-detection", content: "telephone=no"},
        {name: "robots", content: "noindex"},
        {
          property: "og:title",
          content:
            "Федеральная государственная информационная система «Моя школа»",
        },
        {
          property: "og:description",
          content:
            "Федеральная государственная информационная система «Моя школа»",
        },
        {property: "og:image", content: "/icons/head/og-image.png"},
        {property: "og:type", content: "website"},
        {
          property: "og:site_name",
          content:
            "Федеральная государственная информационная система «Моя школа»",
        },
      ],
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/icons/head/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/icons/head/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/icons/head/favicon-16x16.png",
        },
        {
          rel: "mask-icon",
          color: "#2e3b44",
          href: "/icons/head/safari-pinned-tab.svg",
        },
        {rel: "shortcut icon", href: "/icons/head/favicon.ico"},
        {rel: "manifest", href: "/manifest.json"},
      ],
      script,
      noscript,
    },
  },

  css: ["~/assets/scss/main.scss"],

  components: {
    global: true,
    dirs: ["~/components"],
  },

  modules: ["nuxt-purgecss", "@pinia/nuxt", "@nuxt-alt/proxy"],

  proxy: {
    proxies: {
      "/api/calendar/": {
        target: process.env.API_GW_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        prependPath: true,
      },
      "/api/dictionary/": {
        target: process.env.API_GW_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        prependPath: true,
      },
      "/api/library/": {
        target: process.env.API_GW_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        prependPath: true,
      },
      "/api/search/": {
        target: process.env.API_GW_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        prependPath: true,
      },
      "/api/thematicCollections/": {
        target: process.env.API_GW_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        prependPath: true,
      },
      "/api/": {
        target: process.env.API_URL,
        changeOrigin: true,
        configure: (proxy, options) => {
        },
      },
    },
  },

  purgecss: {
    safelist: [
      /modal/,
      /.*tooltip.*/,
      /.*popper.*/,
      /collaps/,
      /toast/,
      /fade/,
      /show/,
      /input/,
      /loader/,
      /svg-icon/,
      /svg/,
      /table|tbody|tr|td/,
      /toggled/,
      /section/,
      /checkbox/,
      /radio/,
      /sort/,
      /scoped/,
      /scrollbar/,
      /scrollbar|scroller/,
      /favorite/,
      /fetching/,
      /correct/,
      /wrong/,
      /auth/,
      /profile/,
      /spinner/,
      /graph/,
      /library/,
      /training/,
      /favorite/,
      /search/,
      /error/,
      /test/,
      /task/,
      /nuxt-loading-indicator/,
      /subject/,
      /dp__/,
      /complexityIcon/,
      /chooseAnswer/,
      /smooth-dnd-container/,
      /smooth-dnd-draggable-wrapper/,
      /smooth-dnd-ghost/,
      /shade/,
      /withImg/,
      /swiper/,
      /selection/,
    ],
  },

  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    plugins: [svgLoader()],
  },

  nitro: {
    compressPublicAssets: true,
  },

  runtimeConfig: {
    public: {
      SITE_URL: process.env.SITE_URL,
      API_URL: process.env.API_URL,
      ENV: process.env.NODE_ENV,
      VK_APP_ID: process.env.VK_APP_ID,
      COMING_SOON: process.env.COMING_SOON === "true",
      PRODUCTION: process.env.PRODUCTION === "true",
    },
  },

  devtools: {
    enabled: false,
  },
});
