import type { CSpellUserSettings } from '@cspell/cspell-types';

export default {
  version: '0.2',
  language: 'en',
  ignoreWords: ['DoML', 'TypeScript', 'Sogari'],
  ignorePaths: ['**/*.{js,ts,md,jsx,tsx,mdx,json,jsonc,json5,svg}'],
  useGitignore: true,
} as CSpellUserSettings;
