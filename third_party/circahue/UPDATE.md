# Updating vendored `@igrs/circahue`

npm does not publish a built package yet, and the GitHub tarball only includes
`files: ["dist", …]` without a committed `dist/`. We vendor a built snapshot.

```bash
git clone --depth 1 https://github.com/isamarin/circahue.git /tmp/circahue
cd /tmp/circahue && npm ci && npm run build
rm -rf third_party/circahue/dist
cp -R /tmp/circahue/dist third_party/circahue/
cp /tmp/circahue/{package.json,LICENSE,README.md} third_party/circahue/
cp third_party/circahue/dist/index.js docs/vendor/circahue.js
npm install
```

When `@igrs/circahue` is on the registry, switch `package.json` to the npm
version and drop this folder + `docs/vendor/circahue.js` (import from node_modules
via a Vite docs build instead).
