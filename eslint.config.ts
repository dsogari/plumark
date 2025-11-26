import cspell from '@cspell/eslint-plugin/configs';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import json from '@eslint/json';
import md from '@eslint/markdown';
import jsdoc from 'eslint-plugin-jsdoc';
import tsdoc from 'eslint-plugin-tsdoc';
import { defineConfig } from 'eslint/config';
import ts from 'typescript-eslint';

const gitignorePath = import.meta.require.resolve('./.gitignore');

export default defineConfig(
  includeIgnoreFile(gitignorePath, '.gitignore'),
  ...ts.configs.recommended,
  ...md.configs.recommended,
  {
    files: ['**/*.js'],
    ...js.configs.recommended,
    ...jsdoc.configs['flat/recommended-typescript-error'],
  },
  {
    files: ['**/*.ts'],
    plugins: { tsdoc },
    rules: { 'tsdoc/syntax': 'warn' },
  },
  {
    files: ['**/*.json'],
    language: 'json/json',
    ...json.configs.recommended,
  },
  {
    files: ['**/*.jsonc'],
    language: 'json/jsonc',
    ...json.configs.recommended,
  },
  {
    files: ['**/*.json5'],
    language: 'json/json5',
    ...json.configs.recommended,
  },
  {
    ...cspell.recommended,
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@cspell/spellchecker': 'error',
    },
  },
);
