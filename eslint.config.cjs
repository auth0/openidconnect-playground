const eslintPluginReact = require('eslint-plugin-react')
const eslintPluginJsxA11y = require('eslint-plugin-jsx-a11y')
const babelParser = require('@babel/eslint-parser')

module.exports = [{
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
        parser: babelParser,
       parserOptions: {
       requireConfigFile: false,
       ecmaVersion: 2020,
       sourceType: "module",
       ecmaFeatures: {jsx: true},
       babelOptions: {
            presets: ["@babel/preset-react"]
            },
        },
    },
    plugins: {
        react: eslintPluginReact,
        'jsx-a11y': eslintPluginJsxA11y
    },
    rules: {
        'no-console': 'warn',
        'no-debugger': 'warn',
        semi: ['error', 'always'],
    }
}]