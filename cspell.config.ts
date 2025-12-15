import type { CSpellUserSettings } from '@cspell/cspell-types';

export default {
  version: '0.2',
  language: 'en',
  words: ['sidenote', 'codepoint', 'frontmatter', 'markout'],
  ignoreWords: ['Plumark', 'TypeScript', 'Sogari', 'pmark', 'prefig', 'backref'],
  ignorePaths: ['**/*.{js,ts,jsx,tsx,mdx,json,jsonc,json5,svg}'],
  useGitignore: true,
} as CSpellUserSettings;
