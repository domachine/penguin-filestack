module.exports = {
  external: ['penguin.js/actions', 'xtend'],
  plugins: [require('rollup-plugin-buble')()],
  format: 'cjs'
}
