// Home-page prerender for the CSR (vite + react) website template.
//
// Runs AFTER `vite build` (see package.json "build:dev"). It SSR-renders the
// home page once and bakes the resulting markup into dist/index.html's #root,
// so crawlers that don't execute JS still see real content. The client then
// hydrates it back into the normal CSR app (see src/main.tsx).
//
// Design constraints (do not regress):
//  - Single dist/index.html. This prerenders the HOME PAGE ONLY.
//  - configFile:false => the inner SSR build MUST NOT inherit the project's
//    vite.config.ts (swc plugin, componentTagger, cdn-image plugin, router
//    proxy alias, etc). We build App.tsx in isolation.
//  - resolve.alias '@' => App.tsx and components may import via "@/...".
//  - NON-BLOCKING => any failure logs a warning and exits 0, leaving the CSR
//    dist/index.html untouched. Prerender is an SEO enhancement, never a gate
//    on deploy.
import { readFileSync, writeFileSync, rmSync } from "fs";
import { resolve } from "path";
import React from "react";

const ROOT_RE = /<div\s+id=["']root["'][^>]*>([\s\S]*?)<\/div>/;

function warnAndSkip(msg, err) {
  console.warn(`[prerender] skipped: ${msg}`);
  if (err) console.warn(err?.stack || String(err));
  process.exit(0); // never block the build — CSR dist stays as-is
}

async function run() {
  const cwd = process.cwd();
  const htmlPath = resolve(cwd, "dist/index.html");

  // 1) Read the just-built CSR shell. Guard for self-contained HTML pages
  //    (Lite "Pattern B") that have no React #root — nothing to prerender.
  let template;
  try {
    template = readFileSync(htmlPath, "utf-8");
  } catch (e) {
    return warnAndSkip(`cannot read ${htmlPath}`, e);
  }
  if (!ROOT_RE.test(template)) {
    return warnAndSkip("no <div id=\"root\"> in dist/index.html (self-contained HTML?)");
  }

  // Idempotent: if #root already holds baked markup (e.g. the npm postbuild:dev
  // hook ran AND the build pipeline also invokes this script), do nothing. A
  // second pass would re-match the non-greedy ROOT_RE against nested markup and
  // corrupt the HTML.
  const existing = template.match(ROOT_RE);
  if (existing && existing[1].trim()) {
    console.log("[prerender] skipped: #root already prerendered");
    return process.exit(0);
  }

  let window = null;
  try {
    // 2) Build App.tsx as an isolated SSR bundle. configFile:false keeps the
    //    project's vite.config.ts (swc / componentTagger / cdn plugin) out of it.
    const { build } = await import("vite");
    const { default: reactPlugin } = await import("@vitejs/plugin-react");
    await build({
      configFile: false,
      logLevel: "error",
      plugins: [reactPlugin()],
      resolve: { alias: { "@": resolve(cwd, "src") } },
      build: {
        ssr: true,
        outDir: "dist-ssr",
        emptyOutDir: true,
        rollupOptions: {
          input: "./src/App.tsx",
          output: { format: "es", entryFileNames: "App.js" },
        },
      },
    });

    // 3) Minimal DOM so React + UI libs can render server-side.
    const { Window } = await import("happy-dom");
    window = new Window({
      url: "http://localhost:3000",
      settings: {
        disableJavaScriptFileLoading: true,
        disableJavaScriptEvaluation: true,
        disableCSSFileLoading: true,
      },
    });
    for (const key of [
      "window", "document", "navigator", "location", "history",
      "HTMLElement", "customElements", "matchMedia",
    ]) {
      const value = key === "matchMedia"
        ? (window.matchMedia?.bind(window) ?? (() => ({
            matches: false, addListener() {}, removeListener() {},
            addEventListener() {}, removeEventListener() {},
          })))
        : window[key];
      Object.defineProperty(global, key, { value, writable: true, configurable: true });
    }

    // 4) SSR-render the home page to a hydration-compatible HTML string.
    //    Use renderToString (not the React 19 `prerender` static API): a DOM
    //    router backed by useSyncExternalStore has no server snapshot and the
    //    concurrent prerenderer drops that subtree. renderToString renders it
    //    synchronously AND emits hydration markers matching client hydrateRoot
    //    (renderToStaticMarkup would strip them).
    const { renderToString } = await import("react-dom/server");
    const { default: App } = await import(resolve(cwd, "dist-ssr/App.js"));
    const html = renderToString(React.createElement(App));

    if (!html.trim()) return warnAndSkip("empty SSR output");

    // 5) Inject into #root and write back the single index.html.
    const rendered = template.replace(ROOT_RE, `<div id="root">${html}</div>`);
    writeFileSync(htmlPath, rendered);
    console.log("[prerender] home page baked into dist/index.html");
  } catch (e) {
    return warnAndSkip("render failed", e);
  } finally {
    try { if (window?.happyDOM) await window.happyDOM.close(); } catch {}
    try { rmSync(resolve(cwd, "dist-ssr"), { recursive: true, force: true }); } catch {}
  }
}

run();
