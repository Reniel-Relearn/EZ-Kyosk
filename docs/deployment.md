# Demo Deployment

## Target

- Repository: `https://github.com/Reniel-Relearn/EZ-Kyosk`
- Host: GitHub Pages
- Live URL: `https://reniel-relearn.github.io/EZ-Kyosk/`
- Status: deployed and verified on November 3, 2026
- Database: none for V1

## Deployment behavior

Every push to `main` runs the GitHub Actions workflow in `.github/workflows/deploy-pages.yml`. The workflow installs locked dependencies, runs the Vitest suite, installs Playwright Chromium, runs the browser suite, builds the Vite production bundle, and deploys `dist/` only if all earlier steps pass.

The Vite base path is `/EZ-Kyosk/` because this is a GitHub Pages project site rather than an account-root site.

## GitHub repository setting

GitHub Pages must use **GitHub Actions** as its build and deployment source. This can be activated through the GitHub API or under **Settings → Pages → Build and deployment → Source → GitHub Actions**.

## Future commercial hosting

This deployment is a public, simulated demo. It does not process payments, persist orders, or transmit data. Commercial hosting and any database/API layer require a separate approved requirements and security phase.
