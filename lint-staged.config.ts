import type { Configuration } from 'lint-staged';

export default {
  '*': [
    'prettier --ignore-unknown --write', // other tools may choke on badly formatted input
    'cspell --no-must-find-files',
    'eslint --no-warn-ignored',
  ],
  '*.ts': () => 'bun test --coverage --pass-with-no-tests', // run concurrently
  'packages/core/**/*': () => [
    'bun run --cwd packages/core build',
    'publint --strict packages/core', // publint needs the dist files
  ],
} as const satisfies Configuration;
