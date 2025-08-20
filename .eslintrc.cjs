module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    '@vitejs/eslint-config-react',
    'prettier'
  ],
  plugins: ['react'],
  rules: {
    'react/prop-types': 'off',
  },
}