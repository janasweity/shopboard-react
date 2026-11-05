export default {
  '*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}': [
    'prettier --write',
    'oxlint --deny-warnings',
  ],
  '*.{json,jsonc,css,html,md,yml,yaml}': 'prettier --write',
}
