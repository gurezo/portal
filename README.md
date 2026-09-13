# portal

[gurezo.net](https://gurezo.net/) is a portal for OSS projects, documentation, demos, and applications by gurezo.

This repository hosts the Angular site deployed to that domain. External web apps are linked from the portal rather than copied into this repo.

## Published projects

Projects listed on [gurezo.net](https://gurezo.net/) are grouped as Libraries and CHIRIMEN Tools.

### Libraries

- [`web-serial-rxjs`](https://github.com/gurezo/web-serial-rxjs) — TypeScript library for the Web Serial API with RxJS. Documentation and examples are hosted on this domain:
  - [Documentation](https://gurezo.net/web-serial-rxjs/)
  - [Examples](https://gurezo.net/web-serial-rxjs/examples/)
  - [npm](https://www.npmjs.com/package/@gurezo/web-serial-rxjs)

### CHIRIMEN Tools

These projects are linked from the portal. Their web apps are not copied into this repository.

- [`chirimen-lite-console`](https://github.com/gurezo/chirimen-lite-console) — browser console for CHIRIMEN Lite ([Open App](https://chirimen-lite-console.web.app/))
- [`chirimen-device-dashboard`](https://github.com/gurezo/chirimen-device-dashboard) — search and browse CHIRIMEN-supported devices ([Open App](https://chirimen-device-dashboard.web.app/))
- [`chirimen-certified-devices`](https://github.com/gurezo/chirimen-certified-devices) — data repository for device metadata, examples, images, and schematics. It generates `devices.json` for CHIRIMEN projects.

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

## Project structure

- `apps/site` — Angular portal application deployed to [gurezo.net](https://gurezo.net/)
- `apps/site-e2e` — Playwright tests for the site
- `scripts/import-web-serial-rxjs-static.sh` — downloads the `web-serial-rxjs` static docs/examples artifact into `firebase-public/web-serial-rxjs/`
- `firebase.json` / `.firebaserc` — Firebase Hosting config for project and target `gurezo-portal`

## Deployment

The site is served with Firebase Hosting (`gurezo-portal`) at [gurezo.net](https://gurezo.net/).

`web-serial-rxjs` documentation is imported into `firebase-public` at deploy time. CHIRIMEN web apps stay on their own Hosting sites and are linked from the portal.

Local commands:

```sh
pnpm run build:firebase:site   # build the site into firebase-public
pnpm run build:firebase        # site build plus web-serial-rxjs static import
pnpm run deploy                # deploy firebase-public to Hosting
pnpm run deploy:firebase       # build:firebase then deploy
```

On push to `main`, `.github/workflows/firebase-hosting-merge.yml` builds `firebase-public` and deploys it.
