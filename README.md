# portal

[gurezo.net](https://gurezo.net/) is a portal for OSS projects, documentation, demos, and applications by gurezo.

This repository hosts the Angular site deployed to that domain. External web apps are linked from the portal rather than copied into this repo.

## Published projects

Projects listed on [gurezo.net](https://gurezo.net/) are grouped, in display order, as Libraries, Developer Tools, and CHIRIMEN Tools.

### Libraries

- [`web-serial-rxjs`](https://github.com/gurezo/web-serial-rxjs) — TypeScript library for the Web Serial API with RxJS. Documentation and examples are hosted on this domain:
  - [Documentation](https://gurezo.net/web-serial-rxjs/)
  - [Examples](https://gurezo.net/web-serial-rxjs/examples/)
  - [npm](https://www.npmjs.com/package/@gurezo/web-serial-rxjs)

### Developer Tools

- [`mdn-translation-ja-mcp`](https://github.com/gurezo/mdn-translation-ja-mcp) — an MCP server that assists Japanese MDN translation, synchronization, and review. It is not a browser app. Documentation is hosted on this domain:
  - [Documentation](https://gurezo.net/mdn-translation-ja-mcp/)

### CHIRIMEN Tools

These projects are linked from the portal. Their web apps are not copied into this repository.

- [`chirimen-lite-console`](https://github.com/gurezo/chirimen-lite-console) — browser console for CHIRIMEN Lite ([Open App](https://chirimen-lite-console.web.app/))
- [`chirimen-device-dashboard`](https://github.com/gurezo/chirimen-device-dashboard) — search and browse CHIRIMEN-supported devices ([Open App](https://chirimen-device-dashboard.web.app/))
- [`chirimen-certified-devices`](https://github.com/gurezo/chirimen-certified-devices) — data repository for device metadata, examples, images, and schematics. It generates `devices.json` for CHIRIMEN projects.

### Adding a project

Link other applications from the portal. Do not copy their features into this repository. Static documentation imported at deploy time is described under [Deployment](#deployment).

When the public listing changes:

1. Add a value to `ProjectGroup` in `apps/site/src/app/projects/project.model.ts` only when none of the existing groups fit.
2. Update `PROJECT_GROUP_SECTIONS` and `PROJECTS` in `apps/site/src/app/projects/projects.data.ts`.
3. Update the site unit tests so the group order, card content, and links match that data.
4. Update this Published projects list when a project is added, removed, or moved.
5. Add an external URL only after the destination has been checked. Do not list a URL that returns 404 or redirects to an unintended page. Run `pnpm run check:links` as described in [External link check](#external-link-check).

## Development

This workspace uses [Nx](https://nx.dev) with pnpm. Node.js 24 is used in CI.

```sh
pnpm install
```

Start the local site:

```sh
pnpm nx serve site
```

Create a production build:

```sh
pnpm nx build site
```

Lint and unit-test the site:

```sh
pnpm nx lint site
pnpm nx test site
```

Playwright end-to-end tests:

```sh
pnpm nx e2e site-e2e
```

### External link check

`pnpm run check:links` requests the HTTPS URLs in `apps/site/src/app/projects/projects.data.ts`, `apps/site/src/app/app.html`, and this README. A final status in the 200 range passes, including after a redirect. The command does not decide whether that redirect landed on the intended page. Open the page when you add or change a URL.

`pnpm run test:links` runs the offline tests for extraction and status classification.

The command fails when a URL returns 404 or another error. `npmjs.com` is the exception: automated clients often receive 403 or 429 even when the package page exists. Those two statuses are warnings and do not fail the command. An npm 404 still fails. When you add or change an npm URL, open it in a browser.

GitHub Actions runs the same check every Monday at 09:00 JST, on manual dispatch, and on pull requests that change the files above, the checker, or `package.json`. It is not part of the production deploy workflow. In Actions, `GITHUB_TOKEN` is sent only with requests to GitHub.

## Project structure

- `apps/site` — Angular portal application deployed to [gurezo.net](https://gurezo.net/)
- `apps/site-e2e` — Playwright tests for the site
- `scripts/check-external-links.mjs` — checks published HTTPS URLs and warns when npm blocks the client
- `scripts/import-web-serial-rxjs-static.sh` — downloads the `web-serial-rxjs` static docs/examples artifact into `firebase-public/web-serial-rxjs/`
- `scripts/import-mdn-translation-ja-mcp-docs.sh` — checks out the commit in `scripts/mdn-translation-ja-mcp.sha`, builds TypeDoc, and copies `docs/` to `firebase-public/mdn-translation-ja-mcp/`
- `firebase.json` / `.firebaserc` — Firebase Hosting config for project and target `gurezo-portal`

## Deployment

The site is served with Firebase Hosting (`gurezo-portal`) at [gurezo.net](https://gurezo.net/).

`web-serial-rxjs` documentation and the [mdn-translation-ja-mcp](https://github.com/gurezo/mdn-translation-ja-mcp) TypeDoc site are copied into `firebase-public` at deploy time. The MCP docs are published at [https://gurezo.net/mdn-translation-ja-mcp/](https://gurezo.net/mdn-translation-ja-mcp/). CHIRIMEN web apps stay on their own Hosting sites and are linked from the portal.

`build:firebase:site` deletes `firebase-public` and rebuilds it from the Angular app. Import the static docs only after that step. `mdn-translation-ja-mcp` is not deployed to this Hosting site from its own repository.

### Pin the MCP documentation commit

`scripts/mdn-translation-ja-mcp.sha` holds one 40-character commit SHA. The import script checks out that commit, runs `npm ci`, `npm run docs:build`, and `npm run docs:verify`, then copies `docs/` to `firebase-public/mdn-translation-ja-mcp/`. Replace the SHA and merge to `main` to publish a different documentation revision. Do not point the file at a branch name.

### Local build and preview

```sh
pnpm run build:firebase:site   # rebuild firebase-public from the Angular site
pnpm run build:firebase        # site build, then web-serial-rxjs and MCP docs
pnpm run deploy                # deploy firebase-public to the live channel
pnpm run deploy:firebase       # build:firebase then deploy live
```

`pnpm run deploy` and `pnpm run deploy:firebase` publish the live site. To check a build without replacing production, deploy a preview channel after `pnpm run build:firebase`:

```sh
pnpm exec firebase hosting:channel:deploy CHANNEL_ID \
  --only gurezo-portal \
  --project gurezo-portal \
  --expires 7d
```

`hosting:channel:deploy` adds the `hosting:` prefix to each `--only` value, so pass the target name `gurezo-portal`. `CHANNEL_ID` is a short name such as `mdn-docs`. The command prints a preview URL. On that URL, check `/`, `/web-serial-rxjs/`, and `/mdn-translation-ja-mcp/` (with the trailing slash), plus a nested HTML page, `assets/style.css`, `assets/search.js`, and a missing path.

### Production

A push to `main` runs `.github/workflows/firebase-hosting-merge.yml`. The workflow builds `firebase-public`, imports both static documentation trees, and deploys Hosting channel `live`.

### Rollback

Firebase keeps previous Hosting releases. In the [Firebase console](https://console.firebase.google.com/) open **Hosting**, select site `gurezo-portal`, and roll back from **Release history**.

To copy one channel onto another with the CLI:

```sh
pnpm exec firebase hosting:clone \
  gurezo-portal:SOURCE_CHANNEL \
  gurezo-portal:live \
  --project gurezo-portal
```

`hosting:clone` copies the current release of `SOURCE_CHANNEL`. It does not select an older release from history. Use the console to roll back to a previous release. Use `hosting:clone` when a preview channel already has the tree that should become `live`. Either action replaces the whole site, including the Angular app and both documentation trees.
