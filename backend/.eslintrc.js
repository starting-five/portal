module.exports = {
  // root: true, // Stop ESLint from looking for configs in parent directories
  env: {
    node: true, // Defines global variables for Node.js
    es2021: true,
  },
  rules: {
    // This rule is often the cause for errors about 'require' statements.
    // It's part of the @typescript-eslint/eslint-plugin, which can be
    // configured to run on .js files as well.
    'no-html-link-for-pages': 'off',

    // Another possible rule from eslint-plugin-import that could cause this.
    'import/no-commonjs': 'off',
    '@typescript-eslint/no-require-imports': 'off',
  },
  // If your project has a root ESLint config that you want to partially use,
  // you can extend it and override rules. For example:
  // extends: ['../../.eslintrc.js'], // Adjust path to your root config
};